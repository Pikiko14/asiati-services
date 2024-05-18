import { MetricsLoadInterface } from "../../../interfaces/metrics.interface";

/**
 * Clase encargada de enviar mensajes por correo electrónico
 */
export class MetaService implements MetricsLoadInterface {
  constructor() {}

  /**
   * List metrics
   * @param companyId El id de la compañoa
   */
  async loadMetrics(companyId: string): Promise<any> {
    return {
      meta: companyId,
    };
  }
}
