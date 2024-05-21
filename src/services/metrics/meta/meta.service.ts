import { HandlerRequest } from "../../../utils/handler.request";
import { Company } from "../../../interfaces/companies.interface";
import configuration from "../../../../configuration/configuration";
import { MetricsLoadInterface } from "../../../interfaces/metrics.interface";

/**
 * Clase encargada de enviar mensajes por correo electrónico
 */
export class MetaService implements MetricsLoadInterface {
  protected url: string;
  private headers: any;
  private params: any;

  constructor() {
    this.url = `${configuration.get("META_URL")}/${configuration.get(
      "META_VERSION"
    )}`;
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
  async loadMetrics(company: Company): Promise<any> {
    try {
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * List campains 
   * @param company instancia de la compañia
   */
  public async listCampaings(company: Company): Promise<any> {
    try {
      // instanciate handler request
      const handleRequest = new HandlerRequest(
        this.url,
        []
      );

      // do request
      const campaigns = await handleRequest.doRequest(
        `/act_${company.meta_app_identifier}/campaigns?fields=name,status,account_id&access_token=${company.meta_app_secret}`,
        'GET',
        {}
      );
      if (!campaigns.data) {
        throw new Error("Error obteniendo el listado de campañas.");
      }

      // return data
      return campaigns.data;
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  /**
   * List ads for one campaign 
   * @param company instancia de la compañia
   * @param campaignId Id de la campaña
   */
  public async listAds(company: Company, campaignId: string): Promise<any> {
    try {
      // instanciate handler request
      const handleRequest = new HandlerRequest(
        this.url,
        []
      );

      // do request
      const ads = await handleRequest.doRequest(
        `/${campaignId}/ads?fields=id,name,status,creative&access_token=${company.meta_app_secret}`,
        'GET',
        {}
      );
      if (!ads.data) {
        throw new Error("Error obteniendo el listado de campañas.");
      }

      // return data
      return ads.data;
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

   /**
   * List ads for one campaign 
   * @param company instancia de la compañia
   * @param modelId Id del modelo a filtrar
   */
   public async getMetrics(company: Company, modelId: string): Promise<any> {
    try {
      // instanciate handler request
      const handleRequest = new HandlerRequest(
        this.url,
        []
      );

      // do request
      const metrics = await handleRequest.doRequest(
        `/${modelId}/insights?fields=impressions,spend,dda_results,cost_per_conversion,conversions,conversion_values,conversion_rate_ranking,clicks,action_values,actions&access_token=${company.meta_app_secret}`,
        'GET',
        {}
      );
      if (!metrics.data) {
        throw new Error("Error obteniendo el listado de campañas.");
      }

      // return data
      return metrics.data;
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
