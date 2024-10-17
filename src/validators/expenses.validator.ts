import { NextFunction } from "express";
import { check } from "express-validator";
import { Request, Response } from "express";
import { handlerValidator } from "../utils/handler.validator";
import CompaniesRepository from "../repositories/company.repository";

// companies
const repositoryCompanies = new CompaniesRepository();

export const ExpensesCreation = [
  check("title")
    .exists()
    .withMessage("La descripción es requerida")
    .notEmpty()
    .withMessage("La descripción está vacía")
    .isString()
    .withMessage("La descripción debe ser un string")
    .isLength({ min: 1, max: 255 })
    .withMessage("La descripción debe tener un número de 1 a 255 caracteres"),
  check("amount")
    .exists()
    .withMessage("El monto es requerido")
    .notEmpty()
    .withMessage("El monto está vacío")
    .isNumeric()
    .withMessage("El monto debe ser un número"),
  check("start")
    .exists()
    .withMessage("La fecha de inicio es requerida")
    .notEmpty()
    .withMessage("La fecha de inicio está vacía")
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage("La fecha de inicio debe ser una fecha válida en formato YYYY-MM-DD"),
  check("end")
    .exists()
    .withMessage("La fecha de fin es requerida")
    .notEmpty()
    .withMessage("La fecha de fin está vacía")
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage("La fecha de inicio debe ser una fecha válida en formato YYYY-MM-DD"),
  check("company")
    .exists()
    .withMessage("La empresa es requerida")
    .notEmpty()
    .withMessage("La empresa está vacía")
    .isMongoId()
    .withMessage("La empresa debe ser un id correcto")
    .custom(async (company: string) => {
      const existCompany = await repositoryCompanies.getCompanyById(company);
      if (!existCompany) {
        throw new Error("La empresa no existe");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];
