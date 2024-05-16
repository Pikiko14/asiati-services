import { Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { Company } from "../interfaces/companies.interface";
import { ResponseRequestInterface } from "../interfaces/response.interface";

/**
 * Clase encargada de enviar mensajes por correo electrónico
 */
export class CompaniesService {
  constructor() {
  }

  /**
   * create companies
   * @param res Express response
   * @param body The body of the request
   */
  public async saveCompany(res: Response, body: Company): Promise<Company | void | null | ResponseRequestInterface> {
    try {
      // return data
      return ResponseHandler.createdResponse(
        res,
        body,
        "Usuario creado correctamente."
      );
    } catch (error: any) {
      throw error.message;
    } 
  }
}
