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
exports.AuthController = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const auth_service_1 = require("../services/auth.service");
const express_validator_1 = require("express-validator");
class AuthController {
    constructor() {
        /**
         * Register new user
         * @param req Express request
         * @param res Express response
         * @returns Promise<void>
         */
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = (0, express_validator_1.matchedData)(req);
                return yield this.service.registerUser(res, body);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * Confirm user
         * @param req Express request
         * @param res Express response
         */
        this.userConfirmation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, action } = req.query;
                yield this.service.userConfirmation(res, token, action);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * Confirm user
         * @param req Express request
         * @param res Express response
         */
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = (0, express_validator_1.matchedData)(req);
                yield this.service.login(res, body);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * Recovery password
         * @param req Express request
         * @param res Express response
         */
        this.recovery = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = (0, express_validator_1.matchedData)(req);
                yield this.service.recovery(res, body);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, 'Error on recovery users');
            }
        });
        /**
         * change password
         * @param req Express request
         * @param res Express response
         */
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = (0, express_validator_1.matchedData)(req);
                yield this.service.changePassword(res, body);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, 'Error on change password');
            }
        });
        this.service = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
