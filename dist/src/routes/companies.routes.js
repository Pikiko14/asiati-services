"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const session_middleware_1 = __importDefault(require("../middlewares/session.middleware"));
const companies_controller_1 = require("../controllers/companies.controller");
const permission_middleware_1 = __importDefault(require("../middlewares/permission.middleware"));
const companies_validator_1 = require("../validators/companies.validator");
// init router
const router = (0, express_1.Router)();
exports.router = router;
// instance controller
const controller = new companies_controller_1.CompaniesController();
/**
 * Do create user
 */
router.post("/", session_middleware_1.default, companies_validator_1.createCompanyValidator, (0, permission_middleware_1.default)("create-business"), controller.saveCompany);
/**
 * Do list user
 */
router.get("/", session_middleware_1.default, (0, permission_middleware_1.default)("list-business"), controller.listCompanies);
/**
 * Do delete user
 */
router.delete("/:id", companies_validator_1.CompanyIdValidator, session_middleware_1.default, (0, permission_middleware_1.default)("delete-business"), controller.deleteCompany);
/**
 * Do update user
 */
router.put("/:id", companies_validator_1.CompanyIdValidator, session_middleware_1.default, (0, permission_middleware_1.default)("edit-business"), companies_validator_1.createCompanyValidator, controller.updateCompany);
/**
 * Do list user
 */
router.get("/for-select", session_middleware_1.default, (0, permission_middleware_1.default)("list-users"), controller.listForSelect);
/**
 * List metrics for one store
 */
router.get('/:id/:modelId/metrics', companies_validator_1.CompanyIdValidator, session_middleware_1.default, (0, permission_middleware_1.default)("list-meta-metric"), controller.getMetrics);
/**
 * List campains for one store
 */
router.get('/:id/campaings', companies_validator_1.CompanyIdValidator, session_middleware_1.default, (0, permission_middleware_1.default)("list-meta-metric"), controller.listCampains);
/**
 * List ads for one campaign in one store
 */
router.get('/:id/:campaigns/ads', companies_validator_1.CompanyIdValidator, session_middleware_1.default, (0, permission_middleware_1.default)("list-meta-metric"), controller.listAds);
