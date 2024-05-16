
import mongoose, { Schema, model } from "mongoose";
import { Company } from "../interfaces/companies.interface";

const CompaniesSchema = new Schema<Company>(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      default: "",
    },
    responsable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    meta_app_secret: {
      type: String,
      required: true
    },
    meta_app_identifier: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CompaniesModel = model("companies", CompaniesSchema);

export default CompaniesModel;
