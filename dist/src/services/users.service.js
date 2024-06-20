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
exports.UserService = void 0;
const utils_1 = require("../utils/utils");
const email_service_1 = require("./email.service");
const responseHandler_1 = require("../utils/responseHandler");
const users_repository_1 = __importDefault(require("../repositories/users.repository"));
const broker_interface_1 = require("../interfaces/broker.interface");
class UserService extends users_repository_1.default {
    constructor() {
        super();
        this.utils = new utils_1.Utils();
        this.emailSender = new email_service_1.EmailSenderService();
    }
    /**
     * Create new user
     * @param { Response } resp The response object
     * @param body The body of the request
     * @returns A Promise of 1
     */
    createUser(res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // set password
                body.password = yield this.utils.encryptPassword(body.password ? body.password : '');
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
                // await this.emailSender.sendMessage(message); // validar si se debe activar el envio de correo desde aca
                // return data
                return responseHandler_1.ResponseHandler.createdResponse(res, user, "Usuario creado correctamente.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * List all users
     * @param { Response } res The response object
     * @param page The page number
     * @param perPage The number of items per page
     * @param search The search string
     * @returns A Promise of 1
     */
    listUsers(res, page, perPage, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // validamos la data de la paginacion
                page = page || 1;
                perPage = perPage || 12;
                const skip = (page - 1) * perPage;
                // Iniciar busqueda
                let query = {};
                if (search) {
                    const searchRegex = new RegExp(search, 'i');
                    query = {
                        $or: [
                            { name: searchRegex },
                            { email: searchRegex },
                            { phone: searchRegex },
                            { username: searchRegex },
                            { last_name: searchRegex },
                            { role: searchRegex },
                        ],
                    };
                }
                // do query
                const users = yield this.paginate(query, skip, perPage);
                // return data
                return responseHandler_1.ResponseHandler.createdResponse(res, {
                    users: users.data,
                    totalItems: users.totalItems
                }, "Listado de usuarios.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * delete users
     * @param res
     * @param { string } id
     * @returns A Promise of 1
     */
    deleteUsers(res, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.deleteUser(id);
                return responseHandler_1.ResponseHandler.createdResponse(res, user, "Usuario eliminado correctamente.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * Update users
     * @param res
     * @param { string } id
     * @param { User } body
     * @returns A Promise of 1
     */
    updateUsers(res, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (body.password && body.password.length > 0) {
                    body.password = yield this.utils.encryptPassword(body.password);
                }
                else if ('password' in body) {
                    delete body.password;
                }
                console.log(body);
                const user = yield this.update(id, body);
                return responseHandler_1.ResponseHandler.createdResponse(res, user, "Usuario actualizado correctamente.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * List users for select
     * @param res
     */
    listForSelect(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.listSelect();
                return responseHandler_1.ResponseHandler.createdResponse(res, users, "Listado de usuarios.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
}
exports.UserService = UserService;
