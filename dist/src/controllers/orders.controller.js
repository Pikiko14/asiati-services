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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const orders_service_1 = require("../services/orders.service");
class OrdersController {
    constructor() {
        /**
         * import orders
         * @param req Express req
         * @param res Express res
         */
        this.importOrdersFromExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.importOrdersFromExcel(res, req.file, req.body);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * liat orders
         * @param req Express req
         * @param res Express res
         */
        this.listOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, perPage, search } = req.query; // get pagination data
                yield this.service.listOrders(res, page, perPage, search);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        this.service = new orders_service_1.OrdersService();
    }
}
exports.OrdersController = OrdersController;
