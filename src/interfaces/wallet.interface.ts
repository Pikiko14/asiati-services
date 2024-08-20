import mongoose from "mongoose";
import { TypeOrder } from "./orders.interface";

export enum WalletTypeMovement {
  CREDIT = "ENTRADA",
  DEBIT = "SALIDA",
}

export interface WalletInterface {
  date?: any;
  id?: string;
  _id?: string;
  amount?: number;
  external_id?: string;
  description?: string;
  guide_number?: string;
  order_id?: string;
  type_order?: TypeOrder;
  preview_amount?: number; 
  type?: WalletTypeMovement;
  company?: string | mongoose.Schema.Types.ObjectId;
}
