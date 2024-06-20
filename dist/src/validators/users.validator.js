"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserValidator = exports.UserIdValidator = void 0;
const express_validator_1 = require("express-validator");
const users_repository_1 = __importDefault(require("../repositories/users.repository"));
const handler_validator_1 = require("../utils/handler.validator");
// instanciate all class neccesaries
const repository = new users_repository_1.default();
// id validator
const UserIdValidator = [
    (0, express_validator_1.check)("_id")
        .notEmpty()
        .withMessage("Debes especificar el usuario a editar")
        .isString()
        .withMessage("El id del usuario debe ser un estring")
        .isMongoId()
        .withMessage("El id del usuario debe ser un id correcto")
        .custom((id) => __awaiter(void 0, void 0, void 0, function* () {
        const existUser = yield repository.getUserById(id);
        if (!existUser) {
            throw new Error("El usuario que intentas editar no existe");
        }
        return true;
    })),
    (req, res, next) => (0, handler_validator_1.handlerValidator)(req, res, next),
];
exports.UserIdValidator = UserIdValidator;
const UpdateUserValidator = [
    (0, express_validator_1.check)("username")
        .exists()
        .withMessage("El campo username es requerido")
        .notEmpty()
        .withMessage("El campo usuario no puede estar vacío")
        .isString()
        .withMessage("El campo username debe ser un string")
        .isLength({ min: 5, max: 90 })
        .withMessage("El username debe tener entre 5 y 90 caracteres")
        .custom((username_1, _a) => __awaiter(void 0, [username_1, _a], void 0, function* (username, { req }) {
        const { id } = req.params; // get param user to edit
        const existUser = yield repository.getUserByUsername(username);
        if (existUser && existUser.id !== id) {
            throw new Error("El username ya existe en nuestra base de datos");
        }
        return true;
    })),
    (0, express_validator_1.check)("password")
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
        .withMessage("La contraseña debe tener al menos un caracter especial como $, @, #, &, - o !"),
    (0, express_validator_1.check)("name")
        .exists()
        .withMessage("El nombre no existe")
        .notEmpty()
        .withMessage("El nombre está vacío")
        .isString()
        .withMessage("El nombre debe ser un string")
        .isLength({ min: 4, max: 90 })
        .withMessage("El nombre debe tener un mínimo de 4 caracteres y máximo 90"),
    (0, express_validator_1.check)("last_name")
        .exists()
        .withMessage("El apellido no existe")
        .notEmpty()
        .withMessage("El apellido está vacío")
        .isString()
        .withMessage("El apellido debe ser un string")
        .isLength({ min: 3, max: 90 })
        .withMessage("El apellido debe tener un mínimo de 3 caracteres"),
    (0, express_validator_1.check)("email")
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
        .custom((email_1, _b) => __awaiter(void 0, [email_1, _b], void 0, function* (email, { req }) {
        const { id } = req.params; // get param user to edit
        const existEmail = yield repository.getUserByEmail(email);
        if (existEmail && existEmail.id !== id) {
            throw new Error("El correo electrónico ya existe en nuestros registros");
        }
        return true;
    })),
    (0, express_validator_1.check)("scopes")
        .optional(),
    (0, express_validator_1.check)("phone")
        .optional(),
    (0, express_validator_1.check)("role")
        .optional(),
    (req, res, next) => (0, handler_validator_1.handlerValidator)(req, res, next),
];
exports.UpdateUserValidator = UpdateUserValidator;
