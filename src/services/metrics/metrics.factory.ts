import { MetaService } from "./meta/meta.service";
import {
  MetricsLoadInterface,
  TypeMetrics,
} from "../../interfaces/metrics.interface";

/**
 * Clase que crea objetos de envío de mensajes
 */
export class MetricsFactory {
  /**
   * Crea un objeto de envío de mensajes según el tipo de mensaje
   * @param type Tipo de mensaje (email, sms o whatsapp)
   * @returns Objeto de envío de mensajes
   */
  static createMetricsLoader(type: TypeMetrics): MetricsLoadInterface {
    switch (type) {
      case TypeMetrics.META:
        return new MetaService();

      default:
        throw new Error("Invalid message sender type");
    }
  }
}
