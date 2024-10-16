import mongoose from "mongoose";

export enum TypeOrder {
  DROPI = "Dropi",
  SHOPIFY = "Shopify",
}

export interface OrdersInterface {
  id?: string | mongoose.Schema.Types.ObjectId;
  _id?: string | mongoose.Schema.Types.ObjectId;
  external_id?: string | number;
  date_order?: string | Date;
  phone?: string | number;
  guide_number?: number | string;
  guide_status?: string | string;
  province?: string;
  city?: string;
  order_notes?: string;
  order_conveyor?: string;
  total_order?: string | number;
  order_profit?: string | number;
  freight_price?: string | number;
  return_freight_cost?: string | number;
  products?: string;
  quantity?: number;
  type_order?: TypeOrder;
  quantity_order?: number;
  company?: string | mongoose.Schema.Types.ObjectId;
}

export interface OrderMetricsInterface {
  totalFreight: number;
  cancelledDropi: number;
  rejectedDropi: number;
  totalMoneyInDropi: number;
  returnedFreightDropi: number;
  collectionDropi: number;
  totalDropiOrders: number;
  pendingDropiOrders: number;
  returnedDropiOrders: number;
  totalHealthWellbeing: number;
  totalFreightDelivered: number;
  totalOrdersDropiDelivered: number;
  pendingConfirmationDropiOrders: number;
  cancelledAndRejectedOrders: number;
  deliveredDropiOrders: number;
  shopify: any;
  guiasAnuladas: number;
  totalHistoricalDevolution: number;
  totalHistoricalCancelled: number;
}
