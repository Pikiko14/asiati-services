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
exports.UserController = void 0;
const express_validator_1 = require("express-validator");
const users_service_1 = require("../services/users.service");
const responseHandler_1 = require("../utils/responseHandler");
class UserController {
    constructor() {
        /**
         * create new user
         * @param req Express request
         * @param res Express response
         * @returns Promise<void>
         */
        this.saveUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = (0, express_validator_1.matchedData)(req);
                return yield this.service.createUser(res, body);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * List all users
         */
        this.listUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, perPage, search } = req.query; // get pagination data
                return yield this.service.listUsers(res, page, perPage, search);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * delete users
         */
        this.deleteUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // get pagination data
                return yield this.service.deleteUsers(res, id);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * update users
         */
        this.updateUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // get id from params
                const body = (0, express_validator_1.matchedData)(req);
                return yield this.service.updateUsers(res, id, body);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * list for select
         */
        this.listForSelect = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.service.listForSelect(res);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        this.service = new users_service_1.UserService();
    }
}
exports.UserController = UserController;
