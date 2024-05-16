import { check } from "express-validator";
import UserRepository from "../repositories/user.repository";
import { handlerValidator } from "../utils/handler.validator";
import { NextFunction, Request, Response } from "express";

// instanciate all class neccesaries
const repository = new UserRepository();

// id validator
const UserIdValidator = [
  check("_id")
    .notEmpty()
    .withMessage("Debes especificar el usuario a editar")
    .isString()
    .withMessage("El id del usuario debe ser un estring")
    .isMongoId()
    .withMessage("El id del usuario debe ser un id correcto")
    .custom(async (id: string) => {
      const existUser = await repository.getUserById(id);
      if (!existUser) {
        throw new Error("El usuario que intentas editar no existe");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const UpdateUserValidator = [
  check("username")
    .exists()
    .withMessage("El campo username es requerido")
    .notEmpty()
    .withMessage("El campo usuario no puede estar vacío")
    .isString()
    .withMessage("El campo username debe ser un string")
    .isLength({ min: 5, max: 90 })
    .withMessage("El username debe tener entre 5 y 90 caracteres")
    .custom(async (username: string, { req }) => {
      const { id } = req.params as any; // get param user to edit
      const existUser = await repository.getUserByUsername(username);
      if (existUser && existUser.id !== id) {
        throw new Error("El username ya existe en nuestra base de datos");
      }
      return true;
    }),
  check("password")
    .if((value, { req }) => req.body.password.length > 0)
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe tener al menos una mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe tener al menos una minúscula")
    .matches(/\d/)
    .withMessage("La contraseña debe tener al menos un número")
    .matches(/[$@#&!*-]/)
    .withMessage(
      "La contraseña debe tener al menos un caracter especial como $, @, #, &, - o !"
    ),
  check("name")
    .exists()
    .withMessage("El nombre no existe")
    .notEmpty()
    .withMessage("El nombre está vacío")
    .isString()
    .withMessage("El nombre debe ser un string")
    .isLength({ min: 4, max: 90 })
    .withMessage("El nombre debe tener un mínimo de 4 caracteres y máximo 90"),
  check("last_name")
    .exists()
    .withMessage("El apellido no existe")
    .notEmpty()
    .withMessage("El apellido está vacío")
    .isString()
    .withMessage("El apellido debe ser un string")
    .isLength({ min: 3, max: 90 })
    .withMessage("El apellido debe tener un mínimo de 3 caracteres"),
  check("email")
    .exists()
    .withMessage("El correo electrónico no existe")
    .notEmpty()
    .withMessage("El correo electrónico está vacío")
    .isString()
    .withMessage("El correo electrónico debe ser un string")
    .isEmail()
    .withMessage("Formato de correo electrónico inválido")
    .isLength({ min: 5, max: 90 })
    .withMessage("El correo electrónico debe tener un mínimo de 5 caracteres")
    .custom(async (email: string, { req }) => {
      const { id } = req.params as any; // get param user to edit
      const existEmail = await repository.getUserByEmail(email);
      if (existEmail && existEmail.id !== id) {
        throw new Error("El correo electrónico ya existe en nuestros registros");
      }
      return true;
    }),
  check("scopes")
    .optional(),
  check("phone")
    .optional(),
  check("role")
    .optional(),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
]; 

export {
  UserIdValidator,
  UpdateUserValidator
}
