import { Response } from "express";
import { Utils } from "../utils/utils";
import { ResponseHandler } from "../utils/responseHandler";
import { ResponseRequestInterface } from "../interfaces/response.interface";
import ConfigurationRepository from "../repositories/configuration.repository";
import { ConfigurationInterface } from "../interfaces/configuration.interface";

export class ConfigurationService extends ConfigurationRepository {
  private utils: Utils;
  constructor() {
    super();
    this.utils = new Utils();
  }

  /**
   * create configuration
   * @param res Express response
   * @param body The body of the request
   * @returns Promise
   */
  public async saveConfiguration(
    res: Response,
    body: ConfigurationInterface
  ): Promise<ConfigurationInterface | void | null | ResponseRequestInterface> {
    try {
      // validate if isset
      let configuration = await this.getConfiguration();
      if (configuration) {
        await this.update(configuration._id, body);
      } else {
        // save companies
        configuration = await this.create(body);
      }

      // return data
      return ResponseHandler.createdResponse(
        res,
        configuration,
        "Configuración ajustada correctamente."
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * Get configuration
   * @param res Express response
   * @returns { Promise<ConfigurationInterface | void | null> }
   */
  public async listConfiguration(
    res: Response
  ): Promise<ConfigurationInterface | void | null> {
    try {
      // validate if isset
      let configuration = await this.getConfiguration();

      // return data
      return ResponseHandler.successResponse(
        res,
        configuration,
        "Configuración ajustada correctamente."
      );
    } catch (error: any) {
      throw error.message;
    }
  }
}
