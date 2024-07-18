"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_model_1 = __importDefault(require("../models/orders.model"));
class OrdersRepository {
    constructor() {
        this.model = orders_model_1.default;
    }
    /**
     * Save order in bbdd
     * @param order User
     */
    create(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderDb = yield this.model.create(order);
            return orderDb;
        });
    }
    /**
     * insert Many orders
     * @param order User
     */
    insertMany(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            const ordersDb = yield this.model.insertMany(orders);
            return ordersDb;
        });
    }
    /**
     * get order by
     * @param query
     */
    getBy(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderDb = yield this.model.find(query);
            return orderDb;
        });
    }
    /**
     * paginate order
     * @param page
     * @param perPage
     * @param search
     */
    paginate(query, skip, perPage, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.model.find(query)
                .skip(skip)
                .limit(perPage)
                .populate({
                path: 'company',
                select: 'id name'
            });
            const totalOrders = yield this.model.find(query).countDocuments();
            return {
                data: orders,
                totalItems: totalOrders
            };
        });
    }
    /**
     * Update orders data
     * @param id
     * @param body
     */
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, body, { new: true });
        });
    }
}
exports.default = OrdersRepository;
