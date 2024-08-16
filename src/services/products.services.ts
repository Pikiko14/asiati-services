import { Response } from "express";
import ProductsRepository from "../repositories/products.repository";
import { ProductsInterface } from "./../interfaces/products.interface";
import { ResponseRequestInterface } from "../interfaces/response.interface";
import { ResponseHandler } from "../utils/responseHandler";

/**
 * Clase encargada de enviar mensajes por correo electrónico
 */
export class ProductsService extends ProductsRepository {
  constructor() {
    super();
  }

  /**
   * create products
   * @param { Response } res
   * @param { ProductsInterface } body
   */
  public async createProducts(
    res: Response,
    body: ProductsInterface
  ): Promise<ProductsInterface | void | null | ResponseRequestInterface> {
    try {
      const product = await this.create(body);

      // process response
      ResponseHandler.successResponse(
        res,
        product,
        "Producto creado correctamente."
      );
    } catch (error: any) {
        throw new Error(error.message);
    }
  }
}
