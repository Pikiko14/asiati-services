import { Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";

export class OrdersService {
  constructor() {}

  /**
   * import orders from excel
   * import { Response } from 'express';
   * @param { Response } res
   * @param file
   */
  public async importOrdersFromExcel(
    res: Response,
    file: any,
    body: any
  ) {
    try {
        ResponseHandler.successResponse(res, body, 'Se ha iniciado el proceso de importación de ordenes correctamente.');
    } catch (error: any) {
        throw new Error(error.message);
    }
  }
}