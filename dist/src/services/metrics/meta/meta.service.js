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
exports.MetaService = void 0;
const handler_request_1 = require("../../../utils/handler.request");
const configuration_1 = __importDefault(require("../../../../configuration/configuration"));
/**
 * Clase encargada de enviar mensajes por correo electrónico
 */
class MetaService {
    constructor() {
        this.url = `${configuration_1.default.get("META_URL")}/${configuration_1.default.get("META_VERSION")}`;
        this.headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
        };
        this.params = [];
    }
    /**
     * List metrics
     * @param company Instancia de la compañia
     */
    loadMetrics(company) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
                throw error.message;
            }
        });
    }
    /**
     * List campains
     * @param company instancia de la compañia
     */
    listCampaings(company) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // instanciate handler request
                const handleRequest = new handler_request_1.HandlerRequest(this.url, []);
                // do request
                const campaigns = yield handleRequest.doRequest(`/act_${company.meta_app_identifier}/campaigns?fields=name,status,account_id&access_token=${company.meta_app_secret}`, 'GET', {});
                if (campaigns.error && campaigns.error.message) {
                    throw new Error(campaigns.error.message);
                }
                if (!campaigns.data) {
                    throw new Error("Error obteniendo el listado de campañas.");
                }
                // return data
                return campaigns.data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    /**
     * List ads for one campaign
     * @param company instancia de la compañia
     * @param campaignId Id de la campaña
     */
    listAds(company, campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // instanciate handler request
                const handleRequest = new handler_request_1.HandlerRequest(this.url, []);
                // do request
                const ads = yield handleRequest.doRequest(`/${campaignId}/ads?fields=id,name,status,creative&access_token=${company.meta_app_secret}`, 'GET', {});
                if (!ads.data) {
                    throw new Error("Error obteniendo el listado de campañas.");
                }
                // return data
                return ads.data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    /**
    * List ads for one campaign
    * @param company instancia de la compañia
    * @param modelId Id del modelo a filtrar
    */
    getMetrics(company, modelId, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // instanciate handler request
                const handleRequest = new handler_request_1.HandlerRequest(this.url, []);
                // do request
                const metrics = yield handleRequest.doRequest(`/${modelId}/insights?fields=impressions,spend,dda_results,cost_per_conversion,conversions,conversion_values,conversion_rate_ranking,clicks,action_values,actions&time_range={'since':'${from}','until':'${to}'}&access_token=${company.meta_app_secret}`, 'GET', {});
                if (!metrics.data) {
                    throw new Error("Error obteniendo el listado de campañas.");
                }
                // return data
                return metrics.data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.MetaService = MetaService;
