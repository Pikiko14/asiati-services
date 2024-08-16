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
   * Create products
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

  /**
   * List all products
   * @param { Response } res The response object
   * @param page The page number
   * @param perPage The number of items per page
   * @param search The search string
   * @returns A Promise of 1
   */
  public async listProducts (
    res: Response,
    page: number,
    perPage: number,
    search: string
  ): Promise<ProductsInterface[] | void | null | ResponseRequestInterface> {
    try {
      // validamos la data de la paginacion
      page = page || 1;
      perPage = perPage || 12;
      const skip = (page - 1) * perPage;

      // Iniciar busqueda
      let query: any = {};
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query = {
          $or: [
            { name: searchRegex },
            { value: searchRegex }
          ],
        };
      }

      // do query
      const products = await this.paginate(query, skip, perPage);

      // return data
      return ResponseHandler.createdResponse(
        res,
        {
          products: products.data,
          totalItems: products.totalItems
        },
        "Listado de products."
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * List all products
   * @param { Response } res The response object
   * @param { string } id The product id
   * @returns A Promise of 1
   */
  public async deleteProducts (
    res: Response,
    id: string
  ): Promise<ProductsInterface[] | void | null | ResponseRequestInterface> {
    try {
      const user = await this.deleteProduct(id);

      return ResponseHandler.createdResponse(
        res,
        user,
        "Producto eliminado correctamente."
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * Update products
   * @param res
   * @param { string } id
   * @param { ProductsInterface } body
   * @returns A Promise of 1
   */
  public async updateProducts(res: Response, id: string, body: ProductsInterface): Promise<ProductsInterface | void | null | ResponseRequestInterface> {
    try {
      const product = await this.update(id, body);

      return ResponseHandler.createdResponse(
        res,
        product,
        "Usuario actualizado correctamente."
      );
    } catch (error: any) {
      throw error.message;
    }
  }
}
