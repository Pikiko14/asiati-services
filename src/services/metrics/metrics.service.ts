import { MetricsFactory } from "./metrics.factory";
import { Company } from "../../interfaces/companies.interface";
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
   * @param company Compañia a consultar
   */
  async loadMetrics(type: any, company: Company): Promise<void> {
    try {
      const metrics = MetricsFactory.createMetricsLoader(type);
      const metricsData = await metrics.loadMetrics(company);
      return metricsData;
    } catch (error: any) {
      this.logger.error(error.message, { error });
      throw new Error('No es posible cargar las métricas');
    }
  }
}

export default new MetricsService();

