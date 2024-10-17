import mongoose, { Schema, model } from "mongoose";
import { ConfigurationInterface } from "../interfaces/configuration.interface";

const ConfigurationSchema = new Schema<ConfigurationInterface>(
  {
    general_iva: {
      type: Number,
      required: true,
    },
    fullfilment: {
      type: String,
      required: true,
    },
    renttax: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ConfigurationModel = model('configurations', ConfigurationSchema);

export default ConfigurationModel;
