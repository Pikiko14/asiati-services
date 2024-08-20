import mongoose, { Schema, model } from "mongoose";
import { OrdersInterface, TypeOrder } from "../interfaces/orders.interface";

const OrdersSchema = new Schema<OrdersInterface>(
    {
        external_id: {
            type: String,
            required: true,
            default: ''
        },
        date_order: {
            type: Date,
            required: true,
            default: ''
        },
        phone: {
            type: String,
            required: true,
            default: ''
        },
        guide_number: {
            type: String,
            required: false,
            default: ''
        },
        guide_status: {
            type: String,
            required: true,
            default: ''
        },
        province: {
            type: String,
            required: true,
            default: ''
        },
        city: {
            type: String,
            required: true,
            default: ''
        },
        order_notes: {
            type: String,
            required: false,
            default: ''
        },
        order_conveyor: {
            type: String,
            required: true,
            default: ''
        },
        total_order: {
            type: String,
            required: true,
            default: ''
        },
        order_profit: {
            type: String,
            required: false,
            default: ''
        },
        freight_price: {
            type: String,
            required: true,
            default: ''
        },
        return_freight_cost: {
            type: String,
            required: false,
            default: ''
        },
        products: {
            type: String,
            required: false,
            default: ''
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        type_order: {
            type: String,
            required: true,
            default: TypeOrder.DROPI
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'companies',
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const OrdersModel = model('orders', OrdersSchema);

export default OrdersModel;