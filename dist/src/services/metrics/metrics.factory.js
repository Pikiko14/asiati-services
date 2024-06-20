"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsFactory = void 0;
const meta_service_1 = require("./meta/meta.service");
const metrics_interface_1 = require("../../interfaces/metrics.interface");
/**
 * Clase que crea objetos de envío de mensajes
 */
class MetricsFactory {
    /**
     * Crea un objeto de envío de mensajes según el tipo de mensaje
     * @param type Tipo de mensaje (email, sms o whatsapp)
     * @returns Objeto de envío de mensajes
     */
    static createMetricsLoader(type) {
        switch (type) {
            case metrics_interface_1.TypeMetrics.META:
                return new meta_service_1.MetaService();
            default:
                throw new Error("Invalid message sender type");
        }
    }
}
exports.MetricsFactory = MetricsFactory;
