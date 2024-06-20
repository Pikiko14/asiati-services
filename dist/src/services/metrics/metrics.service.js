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
const metrics_factory_1 = require("./metrics.factory");
const winston_1 = require("winston");
/**
 * Servicio encargado de enviar notificaciones
 */
class MetricsService {
    constructor() {
        this.logger = (0, winston_1.createLogger)({
            level: "error",
            transports: [
                new winston_1.transports.Console(),
                new winston_1.transports.File({ filename: "error.log", level: "error" }),
            ],
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
        });
    }
    /**
     * Load metrics from the external providers
     * @param type Tipo de metrica a cargar
     * @param company Compañia a consultar
     */
    loadMetrics(type, company) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const metrics = metrics_factory_1.MetricsFactory.createMetricsLoader(type);
                const metricsData = yield metrics.loadMetrics(company);
                return metricsData;
            }
            catch (error) {
                this.logger.error(error.message, { error });
                throw new Error('No es posible cargar las métricas');
            }
        });
    }
}
exports.default = new MetricsService();
