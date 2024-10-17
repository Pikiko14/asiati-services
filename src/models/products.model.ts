
import { Schema, model } from "mongoose";
import { ProductsInterface } from "../interfaces/products.interface";

const ProductSschema = new Schema<ProductsInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
        type: Number,
        ref: 'users',
        required: false,
        default: 0
    },
    final_price: {
      type: Number,
      required: false,
      default: 0
    },
    description: {
      type: String,
      required: false,
      default: null
    },
    is_health_and_wellness: {
      type: Boolean,
      required: false,
      default: false
    },
    iva: {
      type: Number,
      required: false,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProductsModel = model("products", ProductSschema);

export default ProductsModel;
