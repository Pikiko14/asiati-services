import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { ResponseHandler } from "../utils/responseHandler";
import { ResponseRequestInterface } from "../interfaces/response.interface";
import { ConfigurationService } from "../services/configuration.service";
import { ConfigurationInterface } from "../interfaces/configuration.interface";
export class ConfigurationController {
  private service: ConfigurationService;

  constructor() {
    this.service = new ConfigurationService();
  }

  /**
   * Save configuration
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  saveConfiguration = async (
    req: Request,
    res: Response
  ): Promise<void | ConfigurationInterface | null | ResponseRequestInterface> => {
    try {
      const body = matchedData(req) as ConfigurationInterface;
      return await this.service.saveConfiguration(res, body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };

  /**
   * get configuration
   * @param req Express req
   * @param res Express res
   */
  getConfiguration = async (req: Request, res: Response): Promise<void | ResponseRequestInterface> => {
    try {
      await this.service.listConfiguration(res);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }
}
