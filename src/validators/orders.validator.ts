import { NextFunction } from "express";
import { check } from "express-validator";
import { Request, Response } from "express";
import { TypeOrder } from "../interfaces/orders.interface";
import { handlerValidator } from "../utils/handler.validator";
import CompaniesRepository from "../repositories/company.repository";

// instanciate repositories
const companiesRepository = new CompaniesRepository();

const OrdersImportValidator = [
  check("file").custom((value, { req }) => {
    // validate if exist file excel
    if (!req.file) {
      throw new Error("Debes seleccionar un archivo excel.");
    }

    // validate mimes excel
    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = req.file.originalname.split(".").pop();
    if (!validExtensions.includes(`.${fileExtension}`)) {
      throw new Error("La extensión del archivo no es válida");
    }

    return true;
  }),
  check("type")
    .exists()
    .withMessage("Debes ingresar el tipo de orden que se cargara")
    .custom((value: TypeOrder) => {
      const typeOrders = Object.values(TypeOrder);
      if (!typeOrders.includes(value)) {
        throw new Error(`El tipo de orden debe ser una de estas opciones: ${typeOrders.join(', ')}`);
      }

      return true;
    }),
  check('company')
    .exists()
    .withMessage("Debes ingresar la empresa a la que pertenecen las ordenes.")
    .isMongoId()
    .withMessage("Debe ser un id mongo correcto")
    .custom(async (val: string) => {
        const issetCompany = await companiesRepository.getCompanyById(val);
        if (!issetCompany) throw new Error("La compañia seleccionada no existe.");

        return true;
    }),

  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

export { OrdersImportValidator };
