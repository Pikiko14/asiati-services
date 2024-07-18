"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orders_interface_1 = require("../interfaces/orders.interface");
const OrdersSchema = new mongoose_1.Schema({
    external_id: {
        type: String,
        required: true,
        default: ''
    },
    date_order: {
        type: String,
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
        default: orders_interface_1.TypeOrder.DROPI
    },
    company: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
});
const OrdersModel = (0, mongoose_1.model)('orders', OrdersSchema);
exports.default = OrdersModel;
