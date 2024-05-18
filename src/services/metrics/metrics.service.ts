import { MetricsFactory } from "./metrics.factory";
import { Logger, createLogger, transports, format } from "winston";

/**
 * Servicio encargado de enviar notificaciones
 */
class MetricsService {
  private logger: Logger = createLogger({
    level: "error",
    transports: [
      new transports.Console(),
      new transports.File({ filename: "error.log", level: "error" }),
    ],
    format: format.combine(format.timestamp(), format.json()),
  });

  /**
   * Load metrics from the external providers
   * @param type Tipo de metrica a cargar
   * @param companyId id de la tienda a consultar
   */
  async loadMetrics(type: any, companyId: string): Promise<void> {
    try {
      const metrics = MetricsFactory.createMetricsLoader(type);
      const metricsData = await metrics.loadMetrics(companyId);
      return metricsData;
    } catch (error: any) {
      this.logger.error(error.message, { error });
      throw new Error('No es posible cargar las métricas');
    }
  }
}

export default new MetricsService();

