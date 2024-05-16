import { Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { Company } from "../interfaces/companies.interface";
import { ResponseRequestInterface } from "../interfaces/response.interface";
import CompaniesRepository from "../repositories/company.repository";

/**
 * Clase encargada de enviar mensajes por correo electrónico
 */
export class CompaniesService extends CompaniesRepository {
  constructor() {
    super();
  }

  /**
   * create company
   * @param res Express response
   * @param body The body of the request
   * @returns Promise
   */
  public async saveCompany(res: Response, body: Company): Promise<Company | void | null | ResponseRequestInterface> {
    try {
      // save companies
      const company = await this.create(body);

      // return data
      return ResponseHandler.createdResponse(
        res,
        company,
        "Tienda creada correctamente."
      );
    } catch (error: any) {
      throw error.message;
    } 
  }

  /**
   * List all companies
   * @param res Express response
   * @param page Number
   * @param perPage Number
   * @param search String
   * @returns
   */
  public async listCompanies (
    res: Response,
    page: number,
    perPage: number,
    search: string
  ): Promise<Company[] | void | null | ResponseRequestInterface> {
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
            { responsable: searchRegex },
            { url: searchRegex },
            { meta_app_secret: searchRegex },
            { meta_app_identifier: searchRegex },
          ],
        };
      }

      // do query
      const companies = await this.paginate(query, skip, perPage);

      // return data
      return ResponseHandler.createdResponse(
        res,
        {
          companies: companies.data,
          totalItems: companies.totalItems
        },
        "Listado de tiendas."
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * delete company
   * @param res
   * @param { string } id
   * @returns A Promise of 1
   */
  public async deleteCompany(res: Response, id: string): Promise<Company | void | null | ResponseRequestInterface> {
    try {
      const user = await this.deleteCompanyBd(id);
      return ResponseHandler.createdResponse(
        res,
        user,
        "Tienda eliminada correctamente."
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * Update company
   * @param res
   * @param { string } id
   * @param { User } body
   * @returns A Promise of 1
   */
  public async updateCompany(res: Response, id: string, body: Company): Promise<Company | void | null | ResponseRequestInterface> {
    try {
      const company = await this.update(id, body);
      return ResponseHandler.createdResponse(
        res,
        company,
        "Compañia actualizada correctamente."
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * List users for select
   * @param res
   * @returns
   */
  public async listForSelect(res: Response): Promise<Company[] | void | null | ResponseRequestInterface> {
    try {
      const users = await this.listSelect();
      return ResponseHandler.createdResponse(
        res,
        users,
        "Listado de compañias."
      );
    } catch (error: any) {
      throw error.message;
    }
  }
}
