import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { ResponseHandler } from "../utils/responseHandler";
import { ProductsService } from "../services/products.services";
import { ProductsInterface } from "../interfaces/products.interface";
import { ResponseRequestInterface } from "../interfaces/response.interface";

export class ProductsController {
  service: ProductsService;

  constructor() {
    this.service = new ProductsService();
  }

  /**
   * Crear producto
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  createProducts = async (
    req: Request,
    res: Response
  ): Promise<void | ProductsInterface | any | ResponseRequestInterface> => {
    try {
      const body = matchedData(req) as ProductsInterface;
      return await this.service.createProducts(res, body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };
}
