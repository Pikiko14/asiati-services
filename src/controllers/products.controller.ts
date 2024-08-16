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

  /**
   * Listar producto
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  listProducts = async (
    req: Request,
    res: Response
  ): Promise<void | ProductsInterface | any | ResponseRequestInterface> => {
    try {
      const { page, perPage, search } = req.query as any; // get pagination data
      return await this.service.listProducts(res, page, perPage, search);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };

  /**
   * Eliminar producto
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  deleteProducts = async (
    req: Request,
    res: Response
  ): Promise<void | ProductsInterface | any | ResponseRequestInterface> => {
    try {
      const { id } = req.params as any; // get pagination data
      return await this.service.deleteProducts(res, id);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };

  /**
   * Modificar productos
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  updateProducts = async (req: Request, res: Response): Promise<void | ProductsInterface | any | ResponseRequestInterface>=> {
    try {
      const { id } = req.params as any; // get id from params
      const body = matchedData(req) as ProductsInterface;
      return await this.service.updateProducts(
        res,
        id,
        body
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }
}
