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
exports.OrdersService = void 0;
const xlsx = __importStar(require("xlsx"));
const utils_1 = require("../utils/utils");
const responseHandler_1 = require("../utils/responseHandler");
const orders_repository_1 = __importDefault(require("../repositories/orders.repository"));
class OrdersService extends orders_repository_1.default {
    constructor() {
        super();
        this.ordersData = [];
        this.ordersDataUpdate = [];
        this.utils = new utils_1.Utils();
    }
    /**
     * import orders from excel
     * import { Response } from 'express';
     * @param { Response } res
     * @param file
     */
    importOrdersFromExcel(res, file, body) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // setImmediate(() => {
                // });
                yield this.processFile(file.buffer, body.type, body.company);
                let ordersBd = [];
                if (this.ordersData.length > 0) {
                    ordersBd = yield this.insertMany(this.ordersData);
                    this.ordersData = [];
                }
                // process response
                responseHandler_1.ResponseHandler.successResponse(res, ordersBd, "Se ha iniciado el proceso de importación de ordenes correctamente.");
            }
            catch (error) {
                throw new Error((_a = error.message) !== null && _a !== void 0 ? _a : error);
            }
        });
    }
    /**
     * Process excel file
     * @param buffer
     */
    processFile(buffer, typeOrder, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    // Process file using xlsx
                    const workbook = xlsx.read(buffer, { type: "buffer", cellDates: true,
                        cellNF: false,
                        cellText: false });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    Object.keys(sheet).forEach(function (s) {
                        if (sheet[s].w) {
                            delete sheet[s].w;
                            sheet[s].z = '0';
                        }
                    });
                    const jsonData = xlsx.utils.sheet_to_json(sheet, { raw: true });
                    // Convert date serial numbers to actual dates
                    const processedData = jsonData.map((row) => {
                        return row;
                    });
                    // Save orders (you can replace this with your actual save logic)
                    try {
                        yield this.prepareOrderData(processedData, typeOrder, companyId);
                        resolve(true);
                    }
                    catch (error) {
                        reject(error);
                    }
                }));
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    /**
     * Save data on bbdd
     * @param orders
     */
    prepareOrderData(orders, typeOrder, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                // Implement your logic to save orders
                let i = 2;
                for (const order of orders) {
                    // do some validations 
                    if (!order['ID']) {
                        reject(`Debes ingresar el ID en la linea ${i}`);
                    }
                    if (!order['FECHA']) {
                        reject(`Debes ingresar la FECHA en la linea ${i}`);
                    }
                    if (!order['TELÉFONO']) {
                        reject(`Debes ingresar el TELÉFONO en la linea ${i}`);
                    }
                    if (!order['ESTATUS']) {
                        reject(`Debes ingresar el ESTATUS en la linea ${i}`);
                    }
                    if (!order['DEPARTAMENTO_DESTINO']) {
                        reject(`Debes ingresar el DEPARTAMENTO_DESTINO en la linea ${i}`);
                    }
                    if (!order['CIUDAD_DESTINO']) {
                        reject(`Debes ingresar la CIUDAD_DESTINO en la linea ${i}`);
                    }
                    if (!order['TRANSPORTADORA']) {
                        reject(`Debes ingresar la TRANSPORTADORA en la linea ${i}`);
                    }
                    if (!order['TOTAL_DE_LA_ORDEN']) {
                        reject(`Debes ingresar el TOTAL_DE_LA_ORDEN en la linea ${i}`);
                    }
                    if (!order['PRODUCTO']) {
                        reject(`Debes ingresar el PRODUCTO en la linea ${i}`);
                    }
                    if (!order['CANTIDAD']) {
                        reject(`Debes ingresar la CANTIDAD en la linea ${i}`);
                    }
                    // prepare total
                    const totalOrder = order["TOTAL_DE_LA_ORDEN"] ? order["TOTAL_DE_LA_ORDEN"] : 0;
                    const profit = order["GANANCIA"] ? order["GANANCIA"] : 0;
                    const freight = order["PRECIO_FLETE"] ? order["PRECIO_FLETE"] : 0;
                    const returnFreight = order["COSTO_DEVOLUCION_FLETE"] ? order["COSTO_DEVOLUCION_FLETE"] : 0;
                    // set order object
                    const object = {
                        external_id: order["ID"],
                        date_order: yield this.utils.formatDateIso(order["FECHA"]),
                        phone: order["TELÉFONO"],
                        guide_number: order["NÚMERO GUIA"] ? `${order["NÚMERO GUIA"]}` : '-',
                        guide_status: order["ESTATUS"],
                        province: order["DEPARTAMENTO_DESTINO"],
                        city: order["CIUDAD_DESTINO"],
                        order_notes: (_a = order["NOTAS"]) !== null && _a !== void 0 ? _a : null,
                        order_conveyor: (_b = order["TRANSPORTADORA"]) !== null && _b !== void 0 ? _b : null,
                        total_order: parseFloat(totalOrder),
                        order_profit: parseFloat(profit !== null && profit !== void 0 ? profit : 0),
                        freight_price: parseFloat(freight !== null && freight !== void 0 ? freight : 0),
                        return_freight_cost: parseFloat(returnFreight !== null && returnFreight !== void 0 ? returnFreight : 0),
                        products: (_c = order["PRODUCTO"]) !== null && _c !== void 0 ? _c : null,
                        quantity: (_d = order["CANTIDAD"]) !== null && _d !== void 0 ? _d : null,
                        type_order: typeOrder !== null && typeOrder !== void 0 ? typeOrder : null,
                        company: companyId
                    };
                    // validete isset orders
                    const issetOrder = yield this.getBy({ external_id: order["ID"] });
                    if (issetOrder && issetOrder.length > 0) {
                        for (const order of issetOrder) {
                            yield this.update(order._id, object);
                        }
                    }
                    else {
                        this.ordersData.push(object);
                    }
                    i++;
                }
                resolve(true);
            }));
        });
    }
    /**
     * liat orders
     * @param res Express res
     */
    listOrders(res, page, perPage, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get pagination data
                page = page || 1;
                perPage = perPage || 12;
                const skip = (page - 1) * perPage;
                // init search quert
                let query = {};
                if (search) {
                    const searchRegex = new RegExp(search, 'i');
                    query = {
                        $or: [
                            { external_id: searchRegex },
                            { date_order: searchRegex },
                            { phone: searchRegex },
                            { guide_number: searchRegex },
                            { province: searchRegex },
                            { city: searchRegex },
                            { order_notes: searchRegex },
                            { order_conveyor: searchRegex },
                            { total_order: searchRegex },
                            { order_profit: searchRegex },
                            { freight_price: searchRegex },
                            { return_freight_cost: searchRegex },
                            { products: searchRegex },
                            { type_order: searchRegex },
                        ],
                    };
                }
                // do query
                const orders = yield this.paginate(query, skip, perPage, search);
                // process response
                responseHandler_1.ResponseHandler.successResponse(res, {
                    companies: orders.data,
                    totalItems: orders.totalItems
                }, "Listado de ordenes.");
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    /**
     * list order metric
     * @param { string } company
     */
    loadMetrics(company, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // filter data by order and company and date from and to
                const query = {
                    company,
                    date_order: {}
                };
                if (from && to) {
                    query.date_order = { $gte: yield this.utils.formatDateIso(from), $lte: yield this.utils.formatDateIso(to) };
                }
                const orders = yield this.getBy(query);
                // ini calculation
                let totalFreight = 0;
                let returnedFreight = 0;
                let totalOrderDropi = 0;
                let totalCancelDropi = 0;
                let totalRejectedDropi = 0;
                let ordersPendingDropi = 0;
                let orderDeliveredDropi = 0;
                let ordersGenerateDropi = 0;
                let ordersReturnedDropi = 0;
                let totalCollectionDropi = 0;
                let totalFreightDelivered = 0;
                let totalOrdersDeliveredDropi = 0;
                let ordersPendingConfirmationDropi = 0;
                const isProccesExternalId = [];
                for (const order of orders) {
                    // validate if is in array
                    const isInArray = isProccesExternalId.includes(order.external_id);
                    // set collection and total deliverid
                    if (!isInArray && order.guide_status === 'ENTREGADO') {
                        totalCollectionDropi += parseInt(order.total_order);
                        orderDeliveredDropi++;
                        totalOrdersDeliveredDropi += parseInt(order.total_order);
                        totalFreightDelivered += parseInt(order.freight_price);
                    }
                    // set count of devolution orders
                    if (!isInArray && order.guide_status === 'DEVOLUCION') {
                        ordersReturnedDropi++;
                    }
                    // get freight from order in devolution
                    if (order.guide_status === 'DEVOLUCION') {
                        returnedFreight += parseInt(order.freight_price);
                    }
                    // set count of pending orders
                    if (!isInArray && order.guide_status === 'PENDIENTE')
                        ordersPendingDropi++;
                    // set count of pending confirmation orders
                    if (!isInArray && order.guide_status === 'PENDIENTE CONFIRMACION')
                        ordersPendingConfirmationDropi++;
                    // set count of calcelled confirmation orders
                    if (!isInArray && order.guide_status === 'CANCELADO')
                        totalCancelDropi++;
                    // set count of calcelled confirmation orders
                    if (!isInArray && order.guide_status === 'RECHAZADO')
                        totalRejectedDropi++;
                    // set count total orders
                    if (!isInArray) {
                        ordersGenerateDropi++;
                    }
                    // set total orders
                    totalFreight += parseInt(order.freight_price);
                    totalOrderDropi += parseInt(order.total_order);
                    isProccesExternalId.push(order.external_id);
                }
                return {
                    totalFreight: totalFreight,
                    returnedFreightDropi: returnedFreight,
                    cancelledDropi: totalCancelDropi,
                    rejectedDropi: totalRejectedDropi,
                    totalMoneyInDropi: totalOrderDropi,
                    collectionDropi: totalCollectionDropi,
                    totalDropiOrders: ordersGenerateDropi,
                    pendingDropiOrders: ordersPendingDropi,
                    returnedDropiOrders: ordersReturnedDropi,
                    deliveredDropiOrders: orderDeliveredDropi,
                    totalFreightDelivered: totalFreightDelivered,
                    totalOrdersDropiDelivered: totalOrdersDeliveredDropi,
                    pendingConfirmationDropiOrders: ordersPendingConfirmationDropi,
                    cancelledAndRejectedOrders: totalCancelDropi + totalRejectedDropi,
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.OrdersService = OrdersService;
