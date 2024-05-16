import { check } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { handlerValidator } from "../utils/handler.validator";
import CompaniesRepository from "../repositories/company.repository";

// instanciate all class neccesaries
const repository = new CompaniesRepository();

// id validator
const CompanyIdValidator = [
  check("_id")
    .notEmpty()
    .withMessage("Debes especificar la tienda")
    .isString()
    .withMessage("El id de la tienda debe ser un estring")
    .isMongoId()
    .withMessage("El id de la tienda debe ser un id correcto")
    .custom(async (id: string) => {
      const existUser = await repository.getCompanyById(id);
      if (!existUser) {
        throw new Error("La tienda que intentas editar no existe");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const createCompanyValidator = [
  check("name")
    .exists()
    .withMessage("El campo nombre es requerido")
    .notEmpty()
    .withMessage("El campo nombre no puede estar vacío")
    .isString()
    .withMessage("El campo nombre debe ser un string")
    .isLength({ min: 5, max: 90 })
    .withMessage("El nombre debe tener entre 5 y 90 caracteres")
    .custom(async (username: string, { req }) => {
      const { id } = req.params as any; // get param user to edit
      const existUser = await repository.getCompanyByCompanyName(username);
      if (existUser && existUser.id !== id) {
        throw new Error("El nombre ya existe en nuestra base de datos");
      }
      return true;
    }),
  check("responsable")
    .exists()
    .withMessage("El responsable no existe")
    .notEmpty()
    .withMessage("El responsable está vacío")
    .isString()
    .withMessage("El responsable debe ser un string")
    .isMongoId()
    .withMessage("El responsable debe ser un id correcto"),
  check("url")
    .exists()
    .withMessage("La url no existe")
    .notEmpty()
    .withMessage("La url está vacío")
    .isString()
    .withMessage("La url debe ser un string")
    .isLength({ min: 3, max: 90 })
    .withMessage("El apellido debe tener un mínimo de 3 caracteres"),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
]; 

export {
  CompanyIdValidator,
  createCompanyValidator
}
