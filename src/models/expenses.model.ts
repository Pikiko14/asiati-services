import mongoose, { Schema, model } from "mongoose";
import { ExpensesInterface } from "../interfaces/expenses.interface";

const ExpenseSchema = new Schema<ExpensesInterface>(
  {
    amount: {
      type: Number,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ExpenseModel = model("expenses", ExpenseSchema);

export default ExpenseModel;
