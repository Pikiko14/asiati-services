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

  /**
   * List all companies
   * @param req Express request
   * @param res Express response
   *  @returns Promise<void>
   */
  listCompanies = async (req: Request, res: Response): Promise<void | Company | any | ResponseRequestInterface>=> {
    try {
      const { page, perPage, search } = req.query as any; // get pagination data
      return await this.service.listCompanies(
        res,
        page,
        perPage,
        search,
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * delete companies
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  deleteCompany = async (req: Request, res: Response): Promise<void | Company | any | ResponseRequestInterface>=> {
    try {
      const { id } = req.params as any; // get pagination data
      return await this.service.deleteCompany(
        res,
        id
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * update company
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  updateCompany = async (req: Request, res: Response): Promise<void | Company | any | ResponseRequestInterface>=> {
    try {
      const { id } = req.params as any; // get id from params
      const body = matchedData(req) as Company;
      return await this.service.updateCompany(
        res,
        id,
        body
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * list for select
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  listForSelect = async (req: Request, res: Response): Promise<void | Company | any | ResponseRequestInterface>=> {
    try {
      return await this.service.listForSelect(
        res
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * List metrics data
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  getMetrics = async (req: Request, res: Response): Promise<void | Company | any | ResponseRequestInterface>=> {
    try {
      const { id } = req.params;
      return await this.service.getMetrics(
        res,
        id
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * List campains
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  listCampains = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      return await this.service.listCampains(
        res,
        id
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * List ads
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  listAds = async (req: Request, res: Response) => {
    try {
      const { id, campaigns } = req.params;
      return await this.service.listAds(
        res,
        id,
        campaigns
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }
}
