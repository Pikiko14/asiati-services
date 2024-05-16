import { Utils } from "../utils/utils";
import { check } from "express-validator";
import { Request, Response, NextFunction } from "express";
import UserRepository from "../repositories/user.repository";
import { handlerValidator } from "../utils/handler.validator";

// Instancia todas las clases necesarias
const utils = new Utils();
const repository = new UserRepository();

// Construye los validadores

const RegisterValidator = [
  check("username")
    .exists()
    .withMessage("El campo username es requerido")
    .notEmpty()
    .withMessage("El campo usuario no puede estar vacío")
    .isString()
    .withMessage("El campo username debe ser un string")
    .isLength({ min: 5, max: 90 })
    .withMessage("El username debe tener entre 5 y 90 caracteres")
    .custom(async (username: string) => {
      const existUser = await repository.getUserByUsername(username);
      if (existUser) {
        throw new Error("El username ya existe en nuestra base de datos");
      }
      return true;
    }),
  check("password")
    .exists()
    .withMessage("La contraseña es requerida")
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
    .custom(async (email: string) => {
      const existEmail = await repository.getUserByEmail(email);
      if (existEmail) {
        throw new Error("El correo electrónico ya existe en nuestros registros");
      }
      return true;
    }),
  check("scopes")
    .optional(),
  check("phone")
    .optional(),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const ConfirmationUserValidator = [
  check("action")
    .exists()
    .withMessage("La acción es requerida")
    .notEmpty()
    .withMessage("La acción está vacía")
    .isString()
    .withMessage("La acción debe ser un string"),
  check("token")
    .exists()
    .withMessage("El token es requerido")
    .notEmpty()
    .withMessage("El token está vacío")
    .isString()
    .withMessage("El token debe ser un string")
    .custom(async (token: string) => {
      const existToken = await repository.getUserByToken(token);
      if (!existToken) {
        throw new Error("El token no existe en nuestros registros");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const LoginValidator = [
  check("username")
    .exists()
    .withMessage("El nombre de usuario no existe")
    .notEmpty()
    .withMessage("El nombre de usuario está vacío")
    .isString()
    .withMessage("El nombre de usuario debe ser un string")
    .isLength({ min: 5, max: 90 })
    .withMessage("El nombre de usuario debe tener un mínimo de 5 caracteres")
    .custom(async (username: string) => {
      const existUser = await repository.getUserByUsername(username);
      // Validar si el usuario no existe
      if (!existUser) {
        throw new Error("El nombre de usuario no existe en nuestros registros");
      }
      // Validar si el usuario no está activo
      if (existUser && !existUser.is_active) {
        throw new Error("El usuario no está activo");
      }
      return true;
    }),
  check("password")
    .exists()
    .withMessage("La contraseña está vacía")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una letra mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe contener al menos una letra minúscula")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[$@#&!*-]/)
    .withMessage(
      "La contraseña debe contener al menos un carácter especial como $, @, #, &, - o !"
    ),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const RecoveryValidator = [
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
    .custom(async (email: string) => {
      const existEmail = await repository.getUserByEmail(email);
      if (!existEmail) {
        throw new Error("El correo electrónico no existe en nuestros registros");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const ChangePasswordValidator = [
  check("password")
    .exists()
    .withMessage("La contraseña está vacía")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una letra mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe contener al menos una letra minúscula")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[$@#&!*-]/)
    .withMessage(
      "La contraseña debe contener al menos un carácter especial como $, @, #, &, - o !"
    ),
  check("confirmation_password")
    .exists()
    .withMessage("La contraseña está vacía")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una letra mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe contener al menos una letra minúscula")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[$@#&!*-]/)
    .withMessage(
      "La contraseña debe contener al menos un carácter especial como $, @, #, &, - o !"
    )
    .custom((val: string, { req }) => {
      if (val !== req.body?.password) {
        throw new Error("Las contraseñas no coinciden");
      }
      return true;
    }),
  check("token")
    .exists()
    .withMessage("El token está vacío")
    .custom(async (token: string) => {
      const existToken = await repository.getUserByToken(token);
      if (!existToken) {
        throw new Error("El token no existe en nuestros registros");
      }
      return true;
    })
    .custom(async (token: string) => {
      const isValid = await utils.verifyToken(token);
      if (!isValid) {
        throw new Error("El token ha caducado");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

export {
  LoginValidator,
  RegisterValidator,
  RecoveryValidator,
  ChangePasswordValidator,
  ConfirmationUserValidator,
};
