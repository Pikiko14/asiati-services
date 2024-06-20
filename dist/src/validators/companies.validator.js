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
exports.createCompanyValidator = exports.CompanyIdValidator = void 0;
const express_validator_1 = require("express-validator");
const handler_validator_1 = require("../utils/handler.validator");
const users_repository_1 = __importDefault(require("../repositories/users.repository"));
const company_repository_1 = __importDefault(require("../repositories/company.repository"));
// instanciate all class neccesaries
const repository = new company_repository_1.default();
const userRepository = new users_repository_1.default();
// id validator
const CompanyIdValidator = [
    (0, express_validator_1.check)("id")
        .notEmpty()
        .withMessage("Debes especificar la tienda")
        .isString()
        .withMessage("El id de la tienda debe ser un estring")
        .isMongoId()
        .withMessage("El id de la tienda debe ser un id correcto")
        .custom((id) => __awaiter(void 0, void 0, void 0, function* () {
        const existUser = yield repository.getCompanyById(id);
        if (!existUser) {
            throw new Error("La tienda que intentas editar no existe");
        }
        return true;
    })),
    (req, res, next) => (0, handler_validator_1.handlerValidator)(req, res, next),
];
exports.CompanyIdValidator = CompanyIdValidator;
const createCompanyValidator = [
    (0, express_validator_1.check)("name")
        .exists()
        .withMessage("El campo nombre es requerido")
        .notEmpty()
        .withMessage("El campo nombre no puede estar vacío")
        .isString()
        .withMessage("El campo nombre debe ser un string")
        .isLength({ min: 5, max: 90 })
        .withMessage("El nombre debe tener entre 5 y 90 caracteres")
        .custom((name_1, _a) => __awaiter(void 0, [name_1, _a], void 0, function* (name, { req }) {
        const { id } = req.params; // get param user to edit
        const existName = yield repository.getCompanyByCompanyName(name);
        if (existName && existName.id !== id) {
            throw new Error("El nombre ya existe en nuestra base de datos");
        }
        return true;
    })),
    (0, express_validator_1.check)("responsable")
        .exists()
        .withMessage("El responsable no existe")
        .notEmpty()
        .withMessage("El responsable está vacío")
        .isString()
        .withMessage("El responsable debe ser un string")
        .isMongoId()
        .withMessage("El responsable debe ser un id correcto")
        .custom((responsable_1, _b) => __awaiter(void 0, [responsable_1, _b], void 0, function* (responsable, { req }) {
        const existResponsable = yield userRepository.getUserById(responsable);
        if (!existResponsable) {
            throw new Error("El responsable no existe en nuestra base de datos");
        }
        return true;
    })),
    (0, express_validator_1.check)("url")
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
    (0, express_validator_1.check)("meta_app_identifier")
        .exists()
        .withMessage("El identificador de la app no existe")
        .notEmpty()
        .withMessage("El identificador de la app está vacío")
        .isNumeric()
        .withMessage("El identificador de la app debe ser numérico")
        .isLength({ min: 1, max: 90 })
        .withMessage("La url debe tener un mínimo de 1 y un maximo de 90 caracteres"),
    (0, express_validator_1.check)("meta_app_secret")
        .exists()
        .withMessage("El secret de la app no existe")
        .notEmpty()
        .withMessage("El secret de la app está vacío")
        .isString()
        .withMessage("El secret de la app debe ser un string")
        .isLength({ min: 1, max: 500 })
        .withMessage("La url debe tener un mínimo de 1 y un maximo de 50 caracteres"),
    (req, res, next) => (0, handler_validator_1.handlerValidator)(req, res, next),
];
exports.createCompanyValidator = createCompanyValidator;
