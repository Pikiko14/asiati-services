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
exports.OrdersImportValidator = void 0;
const express_validator_1 = require("express-validator");
const orders_interface_1 = require("../interfaces/orders.interface");
const handler_validator_1 = require("../utils/handler.validator");
const company_repository_1 = __importDefault(require("../repositories/company.repository"));
// instanciate repositories
const companiesRepository = new company_repository_1.default();
const OrdersImportValidator = [
    (0, express_validator_1.check)("file").custom((value, { req }) => {
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
    (0, express_validator_1.check)("type")
        .exists()
        .withMessage("Debes ingresar el tipo de orden que se cargara")
        .custom((value) => {
        const typeOrders = Object.values(orders_interface_1.TypeOrder);
        if (!typeOrders.includes(value)) {
            throw new Error(`El tipo de orden debe ser una de estas opciones: ${typeOrders.join(', ')}`);
        }
        return true;
    }),
    (0, express_validator_1.check)('company')
        .exists()
        .withMessage("Debes ingresar la empresa a la que pertenecen las ordenes.")
        .isMongoId()
        .withMessage("Debe ser un id mongo correcto")
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const issetCompany = yield companiesRepository.getCompanyById(val);
        if (!issetCompany)
            throw new Error("La compañia seleccionada no existe.");
        return true;
    })),
    (req, res, next) => (0, handler_validator_1.handlerValidator)(req, res, next),
];
exports.OrdersImportValidator = OrdersImportValidator;
