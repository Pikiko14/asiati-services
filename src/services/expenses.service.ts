import { Response } from "express";
import { Utils } from "../utils/utils";
import { ResponseHandler } from "../utils/responseHandler";
import ExpenseRepository from "../repositories/expenses.repository";
import { ExpensesInterface } from './../interfaces/expenses.interface';
import { ResponseRequestInterface } from "../interfaces/response.interface";

export class ExpensesService extends ExpenseRepository {
  private utils: Utils;
  constructor() {
    super();
    this.utils = new Utils();
  }

  /**
   * create configuration
   * @param res Express response
   * @param body The body of the request
   * @returns Promise
   */
  public async saveExpenses(
    res: Response,
    body: ExpensesInterface
  ): Promise<ExpensesInterface | void | null | ResponseRequestInterface> {
    try {
      const expense = await this.create(body);

      // return data
      return ResponseHandler.createdResponse(
        res,
        expense,
        "Gasto creado correctamente."
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * List expenses
   * @param res Express response
   * @returns Promise<void>
   */
  listExpenses = async (
    res: Response,
    company: string
  ): Promise<ExpensesInterface | void | null | ResponseRequestInterface>  => {
    try {
      // get expenses
      const expenses = await this.getExpensesByCompany(company);

      // return data
      return ResponseHandler.createdResponse(
        res,
        expenses,
        "Listado de gastos."
      );
    } catch (error: any) {
      throw error.message;
    }
  };

  /**
   * update configuration
   * @param res Express response
   * @param id The id of the request
   * @param body The body of the request
   * @returns Promise
   */
  public async updateExpense(
    res: Response,
    id: string,
    body: ExpensesInterface
  ): Promise<ExpensesInterface | void | null | ResponseRequestInterface> {
    try {
      const expense = await this.update(id, body);

      // return data
      return ResponseHandler.createdResponse(
        res,
        expense,
        "Gasto modificado correctamente."
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * delete configuration
   * @param res Express response
   * @param id The id of the request
   * @param body The body of the request
   * @returns Promise
   */
  public async deleteExpense(
    res: Response,
    id: string,
  ): Promise<ExpensesInterface | void | null | ResponseRequestInterface> {
    try {
      const expense = await this.delete(id);

      // return data
      return ResponseHandler.createdResponse(
        res,
        expense,
        "Gasto eliminado correctamente."
      );
    } catch (error: any) {
      throw error.message;
    }
  }
}
