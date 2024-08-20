import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { WalletsService } from "../services/wallets.service";
import { ResponseRequestInterface } from "../interfaces/response.interface";

export class WalletsController {
  service: WalletsService;

  constructor() {
    this.service = new WalletsService();
  }

  /**
   * import orders
   * @param req Express req
   * @param res Express res
   */
  importWalletsFromExcel = async (req: Request, res: Response): Promise<void | ResponseRequestInterface> => {
    try {
      await this.service.importWalletsFromExcel(res, req.file, req.body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * liat orders
   * @param req Express req
   * @param res Express res
   */
  listWallets = async (req: Request, res: Response): Promise<void | ResponseRequestInterface> => {
    try {
      const { page, perPage, search } = req.query as any; // get pagination data
      await this.service.listWallets(res, page, perPage, search);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }
}
