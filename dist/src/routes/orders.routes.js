"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const storage_1 = require("../utils/storage");
const session_middleware_1 = __importDefault(require("../middlewares/session.middleware"));
const orders_controller_1 = require("../controllers/orders.controller");
const permission_middleware_1 = __importDefault(require("../middlewares/permission.middleware"));
const orders_validator_1 = require("../validators/orders.validator");
const router = (0, express_1.Router)();
exports.router = router;
const controller = new orders_controller_1.OrdersController();
/**
 * Import orders route
 */
router.post("/import", session_middleware_1.default, (0, permission_middleware_1.default)("import-orders"), storage_1.upload.single('file'), orders_validator_1.OrdersImportValidator, controller.importOrdersFromExcel);
/**
 * Import orders route
 */
router.get("/", session_middleware_1.default, (0, permission_middleware_1.default)("list-orders"), controller.listOrders);
