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
exports.CompaniesService = void 0;
const orders_service_1 = require("./orders.service");
const meta_service_1 = require("./metrics/meta/meta.service");
const responseHandler_1 = require("../utils/responseHandler");
const company_repository_1 = __importDefault(require("../repositories/company.repository"));
/**
 * Clase encargada de enviar mensajes por correo electrónico
 */
class CompaniesService extends company_repository_1.default {
    constructor() {
        super();
        this.metaService = new meta_service_1.MetaService();
        this.orderService = new orders_service_1.OrdersService();
    }
    /**
     * create company
     * @param res Express response
     * @param body The body of the request
     * @returns Promise
     */
    saveCompany(res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // save companies
                let company = yield this.create(body);
                company = (yield this.getCompanyById(company.id));
                // return data
                return responseHandler_1.ResponseHandler.createdResponse(res, company, "Tienda creada correctamente.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * List all companies
     * @param res Express response
     * @param page Number
     * @param perPage Number
     * @param search String
     * @returns
     */
    listCompanies(res, page, perPage, search) {
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
                            { url: searchRegex },
                            { meta_app_secret: searchRegex },
                            { meta_app_identifier: searchRegex },
                        ],
                    };
                }
                // do query
                const companies = yield this.paginate(query, skip, perPage);
                // return data
                return responseHandler_1.ResponseHandler.createdResponse(res, {
                    companies: companies.data,
                    totalItems: companies.totalItems
                }, "Listado de tiendas.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * delete company
     * @param res
     * @param { string } id
     * @returns A Promise of 1
     */
    deleteCompany(res, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.deleteCompanyBd(id);
                return responseHandler_1.ResponseHandler.createdResponse(res, user, "Tienda eliminada correctamente.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * Update company
     * @param res
     * @param { string } id
     * @param { User } body
     * @returns A Promise of 1
     */
    updateCompany(res, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let company = yield this.update(id, body);
                company = yield this.getCompanyById(id);
                return responseHandler_1.ResponseHandler.createdResponse(res, company, "Compañia actualizada correctamente.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * List users for select
     * @param res
     * @returns
     */
    listForSelect(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.listSelect();
                return responseHandler_1.ResponseHandler.createdResponse(res, users, "Listado de compañias.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * List meta data from company
     * @param res
     * @param { string } id
     * @param modelId id del modelo a filtrar en metricas
     */
    getMetrics(res, id, modelId, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get company
                const company = yield this.getCompanyById(id);
                if (!id) {
                    throw new Error("No se pudo encontrar la compañia.");
                }
                if (!company.meta_app_secret || !company.meta_app_identifier) {
                    throw new Error("Falta el app secret o el app identificador de meta.");
                }
                // get meta metric
                const metrics = yield this.metaService.getMetrics(company, modelId, from, to);
                // get order metric
                const orderMetric = yield this.orderService.loadMetrics(id, from, to);
                // return data
                return responseHandler_1.ResponseHandler.createdResponse(res, {
                    metrics,
                    orderMetric
                }, "Listado de metricas.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * List meta campaign
     * @param res
     * @param { string } id
     */
    listCampains(res, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get company
                const company = yield this.getCompanyById(id);
                if (!company) {
                    throw new Error("No se pudo encontrar la compañia.");
                }
                if (!company.meta_app_secret || !company.meta_app_identifier) {
                    throw new Error("Falta el app secret o el app identificador de meta.");
                }
                // get meta metric
                const campains = yield this.metaService.listCampaings(company);
                // return data
                return responseHandler_1.ResponseHandler.createdResponse(res, {
                    campains
                }, "Listado de campañas.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * List meta campaign ads
     * @param res
     * @param { string } id
     * @param campaigns Id de campaña
     */
    listAds(res, id, campaigns) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get company
                const company = yield this.getCompanyById(id);
                if (!id) {
                    throw new Error("No se pudo encontrar la compañia.");
                }
                if (!company.meta_app_secret || !company.meta_app_identifier) {
                    throw new Error("Falta el app secret o el app identificador de meta.");
                }
                // get meta metric
                const ads = yield this.metaService.listAds(company, campaigns);
                // return data
                return responseHandler_1.ResponseHandler.createdResponse(res, {
                    ads
                }, "Listado de anuncios.");
            }
            catch (error) {
                throw error.message;
            }
        });
    }
}
exports.CompaniesService = CompaniesService;
