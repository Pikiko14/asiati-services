import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { ResponseHandler } from "../utils/responseHandler";
import { ExpensesService } from "../services/expenses.service";
import { ExpensesInterface } from './../interfaces/expenses.interface';
import { ResponseRequestInterface } from "../interfaces/response.interface";

export class ExpensesController {
  private service: ExpensesService;

  constructor() {
    this.service = new ExpensesService();
  }

  /**
   * Save expenses
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  saveExpenses = async (
    req: Request,
    res: Response
  ): Promise<void | ExpensesInterface | null | ResponseRequestInterface> => {
    try {
      const body = matchedData(req) as ExpensesInterface;
      return await this.service.saveExpenses(res, body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };

  /**
   * List expenses
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  listExpenses = async (
    req: Request,
    res: Response
  ): Promise<void | ExpensesInterface[] | null | ResponseRequestInterface> => {
    try {
      const { company = null } = req.params as any;
      await this.service.listExpenses(res, company);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };

  /**
   * update expenses
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  updateExpense = async (
    req: Request,
    res: Response
  ): Promise<void | ExpensesInterface | null | ResponseRequestInterface> => {
    try {
      const { id } = req.params as any;
      const body = matchedData(req) as ExpensesInterface;
      return await this.service.updateExpense(res, id, body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };

  /**
   * delete expenses
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  deleteExpense = async (
    req: Request,
    res: Response
  ): Promise<void | ExpensesInterface | null | ResponseRequestInterface> => {
    try {
      const { id } = req.params as any;
      return await this.service.deleteExpense(res, id);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  };
}
