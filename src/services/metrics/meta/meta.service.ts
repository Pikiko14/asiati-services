import { HandlerRequest } from "../../../utils/handler.request";
import { Company } from "../../../interfaces/companies.interface";
import configuration from "../../../../configuration/configuration";
import { MetricsLoadInterface } from "../../../interfaces/metrics.interface";
import {
  FacebookAdsApi,
  AdAccount,
} from "facebook-nodejs-business-sdk";

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
      // instance request handler 'https://graph.facebook.com/v19.0/120208237909350289/insights?time_range={%22since%22%3A%222024-01-01%22%2C%22until%22%3A%222024-05-19%22}&fields=actions,impressions,spend&access_token=EAALgPUZAQdqkBO6jkSfLj3FCIpJynExcQGTQcT8b8LZAN3pnPOZAo9YEo3iLJlt7KQzBzWsvRJCg2Fmn38VlfNhMQ0o3gZAj3lsTUnHsjXXnmndhxzUB4StDYmmebXGfguXZANZBVmOWK0z6xXZCOY1TrDTHR46aQCt0o9ZB28QNZBDFQ0SDb3cvLHS9Y23TScMMZD'
      let access_token: string =
        "EAALgPUZAQdqkBO6jkSfLj3FCIpJynExcQGTQcT8b8LZAN3pnPOZAo9YEo3iLJlt7KQzBzWsvRJCg2Fmn38VlfNhMQ0o3gZAj3lsTUnHsjXXnmndhxzUB4StDYmmebXGfguXZANZBVmOWK0z6xXZCOY1TrDTHR46aQCt0o9ZB28QNZBDFQ0SDb3cvLHS9Y23TScMMZD";
      let ad_account_id: string = "act_1608951619294600";
      let app_secret: string = "1a86b13252b135c5da3a1e53b8d8c456";
      let app_id: string = "809503730726569";
      const api: FacebookAdsApi = FacebookAdsApi.init(access_token);
      const showDebugingInfo: boolean = true; // Setting this to true shows more debugging info.
      if (showDebugingInfo) {
        api.setDebug(true);
      }

      const fields: string[] = [
      ];
      const params: object = {
        time_range: { since: "2024-01-01", until: "2024-05-19" },
        filtering: [],
        level: "campaign",
        breakdowns: [],
      };

      new AdAccount(ad_account_id)
        .getInsights(fields, params)
        .then((result: any[]) => {
          console.log(result);
          return result
        })
        .catch((error: any) => {
          return error.response.data;
        });
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
}
