import { TypeOrder } from "./orders.interface";

export enum WalletTypeMovement {
    CREDIT = "credit",
    DEBIT = "debit",
}

export interface WalletInterface {
    id?: string;
    _id?: string;
    id_movement: string;
    date: Date;
    type: WalletTypeMovement;
    amount: number;
    preview_amount?: number;
    guide_number?: string;
    description?: string;
    type_order?: TypeOrder;
  }
  