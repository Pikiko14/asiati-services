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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const responseHandler_1 = require("../utils/responseHandler");
// instances
const utils = new utils_1.Utils();
const sessionCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jwtByUser = req.headers.authorization || "";
        const jwt = jwtByUser.split(" ").pop();
        const isUser = yield utils.verifyToken(`${jwt}`);
        if (!isUser) {
            return responseHandler_1.ResponseHandler.handleUnauthorized(res, {}, "Necesitas iniciar sesión para continuar");
        }
        else {
            req.user = isUser;
            next();
        }
    }
    catch (e) {
        return responseHandler_1.ResponseHandler.handleUnauthorized(res, {}, "No has iniciado sesión aun.");
    }
});
exports.default = sessionCheck;
