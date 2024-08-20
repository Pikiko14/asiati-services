import mongoose, { Schema, model } from "mongoose";
import {
  WalletInterface,
  WalletTypeMovement,
} from "../interfaces/wallet.interface";

const WalletsSchema = new Schema<WalletInterface>(
  {
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    external_id: {
      type: String,
      required: true,
      default: "",
    },
    date: {
      type: Date,
      required: false,
      default: null,
    },
    description: {
      type: String,
      required: false,
      default: null,
    },
    guide_number: {
      type: String,
      required: false,
      default: null,
    },
    order_id: {
      type: String,
      required: false,
      default: null,
    },
    type_order: {
      type: String,
      required: false,
      default: null,
    },
    preview_amount: {
      type: Number,
      required: false,
      default: null,
    },
    type: {
      type: String,
      enum: Object.values(WalletTypeMovement),
      default: WalletTypeMovement.CREDIT,
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

const WalletsModel = model("wallets", WalletsSchema);

export default WalletsModel;
