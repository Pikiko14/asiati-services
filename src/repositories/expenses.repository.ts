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
}

export default ExpenseRepository;
