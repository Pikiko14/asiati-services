import { Model } from "mongoose";
import ExpenseModel from "../models/expenses.model";
import { PaginationInterface } from "../interfaces/response.interface";
import { ExpensesInterface } from './../interfaces/expenses.interface';

class ExpenseRepository {
  private readonly model: Model<ExpensesInterface>;

  constructor() {
    this.model = ExpenseModel;
  }
  /**
   * Save expenses in bbdd
   * @param expenses Configuration
   */
  public async create (expense: ExpensesInterface): Promise<ExpensesInterface> {
    const expensesBd = await this.model.create(expense);
    return expensesBd;
  }

  /**
   * List expenses by company
   * @param { string | null } company
   * @return {Promise<ExpensesInterface[]>}
   */
  public async getExpensesByCompany (company: null | string): Promise<ExpensesInterface[]> {
    const query: any = {};
    if (company) {
      query.company = company;
    }
    return await this.model.find(query);
  }

  /**
   * Get expense by id
   * @param id
   */
  public async getExpenseById (id: string): Promise<ExpensesInterface | void | null> {
    return await this.model.findById(id);
  }

  /**
   * Update expenses data
   * @param id
   * @param body
   */
  public async update (id: string, body: ExpensesInterface): Promise<ExpensesInterface | void | null> {
    return await this.model.findByIdAndUpdate(id, body, { new: true });
  }
}

export default ExpenseRepository;
