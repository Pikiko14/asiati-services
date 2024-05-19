import { check } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { handlerValidator } from "../utils/handler.validator";
import UserRepository from "../repositories/users.repository";
import CompaniesRepository from "../repositories/company.repository";

// instanciate all class neccesaries
const repository = new CompaniesRepository();
const userRepository = new UserRepository()

// id validator
const CompanyIdValidator = [
  check("id")
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
    .custom(async (name: string, { req }) => {
      const { id } = req.params as any; // get param user to edit
      const existName = await repository.getCompanyByCompanyName(name);
      if (existName && existName.id !== id) {
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
    .withMessage("El responsable debe ser un id correcto")
    .custom(async (responsable: string, { req }) => {
      const existResponsable = await userRepository.getUserById(responsable);
      if (!existResponsable) {
        throw new Error("El responsable no existe en nuestra base de datos");
      }
      return true;
    }),
  check("url")
    .exists()
    .withMessage("La url no existe")
    .notEmpty()
    .withMessage("La url está vacío")
    .isString()
    .withMessage("La url debe ser un string")
    .isLength({ min: 1, max: 250 })
    .withMessage("La url debe tener un mínimo de 1 caracter")
    .matches(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)
    .withMessage("Formato de url incorrecto"),
  check("meta_app_identifier")
    .exists()
    .withMessage("El identificador de la app no existe")
    .notEmpty()
    .withMessage("El identificador de la app está vacío")
    .isNumeric()
    .withMessage("El identificador de la app debe ser numérico")
    .isLength({ min: 1, max: 90 })
    .withMessage("La url debe tener un mínimo de 1 y un maximo de 90 caracteres"),
  check("meta_app_secret")
    .exists()
    .withMessage("El secret de la app no existe")
    .notEmpty()
    .withMessage("El secret de la app está vacío")
    .isString()
    .withMessage("El secret de la app debe ser un string")
    .isLength({ min: 1, max: 500 })
    .withMessage("La url debe tener un mínimo de 1 y un maximo de 50 caracteres"),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
]; 

export {
  CompanyIdValidator,
  createCompanyValidator
}
