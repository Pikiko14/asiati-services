import { Request, Response } from "express";
import { matchedData } from 'express-validator';
import { ResponseHandler } from "../utils/responseHandler";
import { Company } from "../interfaces/companies.interface";
import { CompaniesService } from "../services/companies.service";
import { ResponseRequestInterface } from "../interfaces/response.interface";

export class CompaniesController {
  public service: CompaniesService;

  constructor() {
    this.service = new CompaniesService()
  }

  /**
   * create new company
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  saveCompany = async (req: Request, res: Response): Promise<void | Company | null | ResponseRequestInterface>  => {
    try {
      const body = matchedData(req) as Company;
      return await this.service.saveCompany(res, body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }
}
