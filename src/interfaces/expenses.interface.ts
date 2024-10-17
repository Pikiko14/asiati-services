import mongoose from "mongoose";

export interface ExpensesInterface {
  amount: number;
  start: string | Date;
  end: string | Date;
  title: string;
  company: string | mongoose.Types.ObjectId;
}
