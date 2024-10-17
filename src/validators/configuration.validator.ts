import { NextFunction } from "express";
import { check } from "express-validator";
import { Request, Response } from "express";
import { handlerValidator } from "../utils/handler.validator";

export const ConfigurationCreation = [
  check("general_iva")
    .exists()
    .withMessage("La iva general es requerida")
    .notEmpty()
    .withMessage("La iva general está vacía")
    .isNumeric()
    .withMessage("La iva general debe ser un número"),
  check("fullfilment")
    .exists()
    .withMessage("El valor fullfilment es requerido")
    .notEmpty()
    .withMessage("El valor fullfilment está vacío")
    .isNumeric()
    .withMessage("El valor fullfilment debe ser un número"),
  check('renttax')
    .optional(),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];
