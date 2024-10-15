import mongoose, { Schema, model } from "mongoose";
import { OrdersInterface, TypeOrder } from "../interfaces/orders.interface";

const OrdersSchema = new Schema<OrdersInterface>(
  {
    external_id: {
      type: String,
      required: false,
      default: "",
    },
    date_order: {
      type: Date,
      required: false,
      default: "",
    },
    phone: {
      type: String,
      required: false,
      default: "",
    },
    guide_number: {
      type: String,
      required: false,
      default: "",
    },
    guide_status: {
      type: String,
      required: false,
      default: "",
    },
    province: {
      type: String,
      required: false,
      default: "",
    },
    city: {
      type: String,
      required: false,
      default: "",
    },
    order_notes: {
      type: String,
      required: false,
      default: "",
    },
    order_conveyor: {
      type: String,
      required: false,
      default: "",
    },
    total_order: {
      type: String,
      required: false,
      default: "",
    },
    order_profit: {
      type: String,
      required: false,
      default: "",
    },
    freight_price: {
      type: String,
      required: false,
      default: "",
    },
    return_freight_cost: {
      type: String,
      required: false,
      default: "",
    },
    products: {
      type: String,
      required: false,
      default: "",
    },
    quantity: {
      type: Number,
      required: false,
      default: 0,
    },
    type_order: {
      type: String,
      required: false,
      default: TypeOrder.DROPI,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      required: false,
    },
    quantity_order: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const OrdersModel = model("orders", OrdersSchema);

export default OrdersModel;
