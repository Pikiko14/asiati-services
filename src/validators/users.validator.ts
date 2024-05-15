import { check } from "express-validator";
import UserRepository from "../repositories/user.repository";
import { handlerValidator } from "../utils/handler.validator";
import { NextFunction, Request, Response } from "express";

// instanciate all class neccesaries
const repository = new UserRepository();

// id validator
const UserIdValidator = [
  check("id")
    .withMessage("User id does not exist")
    .notEmpty()
    .withMessage("user id is empty")
    .isString()
    .withMessage("User id must be a string")
    .isMongoId()
    .withMessage("User id must be a mongo id")
    .custom(async (id: string) => {
      const existUser = await repository.getUserById(id);
      if (!existUser) {
        throw new Error("User id dont´t exist in our records");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

export {
  UserIdValidator
}
