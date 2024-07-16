import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { OrdersService } from "../services/orders.service";

export class OrdersController {
  service: OrdersService;

  constructor() {
    this.service = new OrdersService();
  }

  /**
   * import orders
   * @param req Express req
   * @param res Express res
   */
  importOrdersFromExcel = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(req);
      await this.service.importOrdersFromExcel(res, req.file, req.body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }
}