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
exports.AuthService = void 0;
const utils_1 = require("../utils/utils");
const email_service_1 = require("../services/email.service");
const responseHandler_1 = require("../utils/responseHandler");
const users_repository_1 = __importDefault(require("../repositories/users.repository"));
const broker_interface_1 = require("../interfaces/broker.interface");
class AuthService extends users_repository_1.default {
    constructor() {
        super();
        this.scopes = [];
        this.utils = new utils_1.Utils();
        this.scopes = [
            'create-users',
            'list-users',
            'edit-users',
            'delete-users',
            'create-business',
            'list-business',
            'edit-business',
            'delete-business',
            'list-meta-metric'
        ];
        this.emailSender = new email_service_1.EmailSenderService();
    }
    /**
     * Register new user
     * @param { Response } resp The response object
     * @param body The body of the request
     * @returns A Promise of 1
     */
    registerUser(res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // set password
                body.password = yield this.utils.encryptPassword(body.password);
                body.scopes = this.scopes;
                body.is_active = true;
                // create user on bbdd
                const user = yield this.create(body);
                // set token recovery valid by 1d
                user.confirmation_token = yield this.utils.generateToken(user);
                yield this.update(user.id, user);
                // push notification queue
                const message = {
                    data: {
                        name: user.name,
                        last_name: user.last_name,
                        email: user.email,
                        token: user.confirmation_token,
                        recovery_token: user.recovery_token,
                    },
                    type_notification: broker_interface_1.TypeNotification.EMAIL,
                    template: "welcome",
                };
                yield this.emailSender.sendMessage(message);
                // return data
                return responseHandler_1.ResponseHandler.createdResponse(res, user, "User registered correctly");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * User confirmation
     * @param { Response } resp The response object
     * @param token The token of the request
     * @param action The action of the request
     */
    userConfirmation(res, token, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get user and validate
                const user = yield this.getUserByToken(token);
                // validate action
                let message = "";
                // unsuscribe
                if (user && user.id && action === "unsubscribe") {
                    yield this.deleteUser(user.id);
                    message = "User unsubscribe correctly";
                }
                // do user confirmation
                if (user && user.id && action === "confirm-account" && user.confirmation_token === token) {
                    const verifyToken = yield this.utils.verifyToken(token);
                    if (verifyToken) {
                        user.is_active = true;
                        user.confirmation_token = null;
                        yield this.update(user.id, user);
                        message = "User confirmed correctly";
                    }
                    else {
                        yield this.deleteUser(user.id);
                        message = "Token expired, user confirmation failed";
                    }
                }
                // return response
                return responseHandler_1.ResponseHandler.successResponse(res, user, message);
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * User login
     * @param { Response } res The response object
     * @param body The body of the request
     */
    login(res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.getUserByUsername(body.username);
                // if user exists
                if (user) {
                    // compare password
                    const comparePassword = yield this.utils.comparePassword(user.password, body.password);
                    if (comparePassword) {
                        const token = yield this.utils.generateToken(user);
                        return responseHandler_1.ResponseHandler.successResponse(res, { user, token }, "Has iniciado sesión correctamente");
                    }
                    else {
                        throw new Error("Contraseña incorrecta");
                    }
                }
                else {
                    throw new Error("Contraseña incorrecta");
                }
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * User recovery
     * @param { Response } res The response object
     * @param body The body of the request
     */
    recovery(res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // generate recovery toke
                const { email } = body;
                const user = yield this.getUserByUsername(email);
                if (user) {
                    // generate token recovery
                    const token = yield this.utils.generateTokenForRecoveryPassword({ email });
                    user.recovery_token = token;
                    yield user.save();
                    // push notification queue
                    const message = {
                        data: {
                            name: user.name,
                            last_name: user.last_name,
                            email: user.email,
                            token: user.confirmation_token,
                            recovery_token: user.recovery_token,
                        },
                        type_notification: broker_interface_1.TypeNotification.EMAIL,
                        template: "recovery",
                        subject: "Recovery password",
                        to: email
                    };
                    yield this.emailSender.sendMessage(message);
                }
                // return response
                return responseHandler_1.ResponseHandler.successResponse(res, { token: user.recovery_token }, "Se ha enviado un correo electrónico con las instrucciones para restablecer su contraseñas");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * User change password
     * @param { Response } res The response object
     * @param body The body of the request
     */
    changePassword(res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get user
                const user = yield this.getUserByToken(body.token);
                if (user) {
                    // set new password
                    user.recovery_token = null;
                    user.password = yield this.utils.encryptPassword(body.password);
                    yield this.update(user.id, user);
                    return responseHandler_1.ResponseHandler.successResponse(res, user, "Contraseña cambiada correctamente");
                }
                else {
                    throw new Error("User not found");
                }
            }
            catch (error) {
                throw error.message;
            }
        });
    }
}
exports.AuthService = AuthService;
