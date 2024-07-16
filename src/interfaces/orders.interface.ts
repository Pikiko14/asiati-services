import mongoose from "mongoose";

export interface OrdersInterface {
    id?: string | mongoose.Schema.Types.ObjectId;
    _id: string | mongoose.Schema.Types.ObjectId;
    external_id: string | number;
    date_order: string | Date;
    phone: string | number;
    guide_number?: number;
    guide_status?: string;
    province: string;
    city: string;
    order_notes?: string;
    order_conveyor: string;
    total_order: string | number;
    order_profit?: string | number;
    freight_price: string | number;
    return_freight_cost?: string | number;
    products: string;
    quantity: number;
}