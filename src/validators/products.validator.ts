import { check } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { handlerValidator } from "../utils/handler.validator";
import ProductsRepository from "../repositories/products.repository";

// instanciate all class neccesaries
const repository = new ProductsRepository();

const productsCreationValidator = [
  check("name")
    .exists()
    .withMessage("El campo nombre es requerido")
    .notEmpty()
    .withMessage("El campo nombre no puede estar vacío")
    .isString()
    .withMessage("El campo nombre debe ser un string")
    .isLength({ min: 3, max: 90 })
    .withMessage("El nombre debe tener entre 3 y 90 caracteres"),
  check("value")
    .exists()
    .withMessage("El campo valor es requerido")
    .notEmpty()
    .withMessage("El campo valor no puede estar vacío")
    .isNumeric()
    .withMessage("El campo valor debe ser un numero"),
  check("is_health_and_wellness")
    .exists()
    .withMessage("El campo is_health_and_wellness es requerido")
    .notEmpty()
    .withMessage("El campo is_health_and_wellness no puede estar vacío")
    .isBoolean()
    .withMessage(
      "El campo is_health_and_wellness debe ser (Verdadero o Falso)"
    ),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

// id validator
const ProductsIdValidator = [
  check("id")
    .notEmpty()
    .withMessage("Debes especificar el id producto")
    .isString()
    .withMessage("El id del producto debe ser un estring")
    .isMongoId()
    .withMessage("El id del producto debe ser un id correcto")
    .custom(async (id: string) => {
      const existUser = await repository.getProductById(id);
      if (!existUser) {
        throw new Error("El producto que intentas editar no existe");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

export { productsCreationValidator, ProductsIdValidator };
