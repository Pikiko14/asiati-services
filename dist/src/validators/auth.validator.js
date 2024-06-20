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
exports.ConfirmationUserValidator = exports.ChangePasswordValidator = exports.RecoveryValidator = exports.RegisterValidator = exports.LoginValidator = void 0;
const utils_1 = require("../utils/utils");
const express_validator_1 = require("express-validator");
const users_repository_1 = __importDefault(require("../repositories/users.repository"));
const handler_validator_1 = require("../utils/handler.validator");
// Instancia todas las clases necesarias
const utils = new utils_1.Utils();
const repository = new users_repository_1.default();
// Construye los validadores
const RegisterValidator = [
    (0, express_validator_1.check)("username")
        .exists()
        .withMessage("El campo username es requerido")
        .notEmpty()
        .withMessage("El campo usuario no puede estar vacío")
        .isString()
        .withMessage("El campo username debe ser un string")
        .isLength({ min: 5, max: 90 })
        .withMessage("El username debe tener entre 5 y 90 caracteres")
        .custom((username) => __awaiter(void 0, void 0, void 0, function* () {
        const existUser = yield repository.getUserByUsername(username);
        if (existUser) {
            throw new Error("El username ya existe en nuestra base de datos");
        }
        return true;
    })),
    (0, express_validator_1.check)("password")
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
        .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
        const existEmail = yield repository.getUserByEmail(email);
        if (existEmail) {
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
exports.RegisterValidator = RegisterValidator;
const ConfirmationUserValidator = [
    (0, express_validator_1.check)("action")
        .exists()
        .withMessage("La acción es requerida")
        .notEmpty()
        .withMessage("La acción está vacía")
        .isString()
        .withMessage("La acción debe ser un string"),
    (0, express_validator_1.check)("token")
        .exists()
        .withMessage("El token es requerido")
        .notEmpty()
        .withMessage("El token está vacío")
        .isString()
        .withMessage("El token debe ser un string")
        .custom((token) => __awaiter(void 0, void 0, void 0, function* () {
        const existToken = yield repository.getUserByToken(token);
        if (!existToken) {
            throw new Error("El token no existe en nuestros registros");
        }
        return true;
    })),
    (req, res, next) => (0, handler_validator_1.handlerValidator)(req, res, next),
];
exports.ConfirmationUserValidator = ConfirmationUserValidator;
const LoginValidator = [
    (0, express_validator_1.check)("username")
        .exists()
        .withMessage("El nombre de usuario no existe")
        .notEmpty()
        .withMessage("El nombre de usuario está vacío")
        .isString()
        .withMessage("El nombre de usuario debe ser un string")
        .isLength({ min: 5, max: 90 })
        .withMessage("El nombre de usuario debe tener un mínimo de 5 caracteres")
        .custom((username) => __awaiter(void 0, void 0, void 0, function* () {
        const existUser = yield repository.getUserByUsername(username);
        // Validar si el usuario no existe
        if (!existUser) {
            throw new Error("El nombre de usuario no existe en nuestros registros");
        }
        // Validar si el usuario no está activo
        if (existUser && !existUser.is_active) {
            throw new Error("El usuario no está activo");
        }
        return true;
    })),
    (0, express_validator_1.check)("password")
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
        .withMessage("La contraseña debe contener al menos un carácter especial como $, @, #, &, - o !"),
    (req, res, next) => (0, handler_validator_1.handlerValidator)(req, res, next),
];
exports.LoginValidator = LoginValidator;
const RecoveryValidator = [
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
        .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
        const existEmail = yield repository.getUserByEmail(email);
        if (!existEmail) {
            throw new Error("El correo electrónico no existe en nuestros registros");
        }
        return true;
    })),
    (req, res, next) => (0, handler_validator_1.handlerValidator)(req, res, next),
];
exports.RecoveryValidator = RecoveryValidator;
const ChangePasswordValidator = [
    (0, express_validator_1.check)("password")
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
        .withMessage("La contraseña debe contener al menos un carácter especial como $, @, #, &, - o !"),
    (0, express_validator_1.check)("confirmation_password")
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
        .withMessage("La contraseña debe contener al menos un carácter especial como $, @, #, &, - o !")
        .custom((val, { req }) => {
        var _a;
        if (val !== ((_a = req.body) === null || _a === void 0 ? void 0 : _a.password)) {
            throw new Error("Las contraseñas no coinciden");
        }
        return true;
    }),
    (0, express_validator_1.check)("token")
        .exists()
        .withMessage("El token está vacío")
        .custom((token) => __awaiter(void 0, void 0, void 0, function* () {
        const existToken = yield repository.getUserByToken(token);
        if (!existToken) {
            throw new Error("El token no existe en nuestros registros");
        }
        return true;
    }))
        .custom((token) => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield utils.verifyToken(token);
        if (!isValid) {
            throw new Error("El token ha caducado");
        }
        return true;
    })),
    (req, res, next) => (0, handler_validator_1.handlerValidator)(req, res, next),
];
exports.ChangePasswordValidator = ChangePasswordValidator;
