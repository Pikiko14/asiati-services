import { Response } from "express";
import { OrdersService } from "./orders.service";
import { MetaService } from "./metrics/meta/meta.service";
import { ResponseHandler } from "../utils/responseHandler";
import { Company } from "../interfaces/companies.interface";
import CompaniesRepository from "../repositories/company.repository";
import { ResponseRequestInterface } from "../interfaces/response.interface";

/**
 * Clase encargada de enviar mensajes por correo electrónico
 */
export class CompaniesService extends CompaniesRepository {
  private metaService: MetaService;
  private orderService: OrdersService;

  constructor() {
    super();
    this.metaService = new MetaService();
    this.orderService = new OrdersService();
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
      let company = await this.create(body);
      company = await this.getCompanyById(company.id as string) as Company;

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
      let company = await this.update(id, body);
      company = await this.getCompanyById(id);
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

  /**
   * List meta data from company
   * @param res
   * @param { string } id
   * @param modelId id del modelo a filtrar en metricas
   */
  public async getMetrics(res: Response, id: string, modelId: string, from: string, to: string): Promise<Company | void | null | ResponseRequestInterface> {
    try {
      // get company
      const company = await this.getCompanyById(id) as Company;
      if (!id) {
        throw new Error("No se pudo encontrar la compañia.");
      }
      if (!company.meta_app_secret || !company.meta_app_identifier) {
        throw new Error("Falta el app secret o el app identificador de meta.");
      }

      // get meta metric
      const metrics = await this.metaService.getMetrics(company, modelId, from, to);

      // get order metric
      const orderMetric: any = await this.orderService.loadMetrics(id, from, to);

      // return data
      return ResponseHandler.createdResponse(
        res,
        {
          metrics,
          orderMetric
        },
        "Listado de metricas."
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * List meta campaign
   * @param res
   * @param { string } id
   */
  public async listCampains(res: Response, id: string) {
    try {
      // get company
      const company = await this.getCompanyById(id) as Company;
      if (!company) {
        throw new Error("No se pudo encontrar la compañia.");
      }
      if (!company.meta_app_secret || !company.meta_app_identifier) {
        throw new Error("Falta el app secret o el app identificador de meta.");
      }

      // get meta metric
      const campains = await this.metaService.listCampaings(company);

      // return data
      return ResponseHandler.createdResponse(
        res,
        {
          campains
        },
        "Listado de campañas."
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * List meta campaign ads
   * @param res
   * @param { string } id
   * @param campaigns Id de campaña
   */
  public async listAds(res: Response, id: string, campaigns: string) {
    try {
      // get company
      const company = await this.getCompanyById(id) as Company;
      if (!id) {
        throw new Error("No se pudo encontrar la compañia.");
      }
      if (!company.meta_app_secret || !company.meta_app_identifier) {
        throw new Error("Falta el app secret o el app identificador de meta.");
      }

      // get meta metric
      const ads = await this.metaService.listAds(company, campaigns);

      // return data
      return ResponseHandler.createdResponse(
        res,
        {
          ads
        },
        "Listado de anuncios."
      );
    } catch (error: any) {
      throw error.message;
    }
  }
}
