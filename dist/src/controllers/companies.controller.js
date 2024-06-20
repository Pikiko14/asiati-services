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
exports.CompaniesController = void 0;
const express_validator_1 = require("express-validator");
const responseHandler_1 = require("../utils/responseHandler");
const companies_service_1 = require("../services/companies.service");
class CompaniesController {
    constructor() {
        /**
         * create new company
         * @param req Express request
         * @param res Express response
         * @returns Promise<void>
         */
        this.saveCompany = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = (0, express_validator_1.matchedData)(req);
                return yield this.service.saveCompany(res, body);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * List all companies
         * @param req Express request
         * @param res Express response
         *  @returns Promise<void>
         */
        this.listCompanies = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, perPage, search } = req.query; // get pagination data
                return yield this.service.listCompanies(res, page, perPage, search);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * delete companies
         * @param req Express request
         * @param res Express response
         * @returns Promise<void>
         */
        this.deleteCompany = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // get pagination data
                return yield this.service.deleteCompany(res, id);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * update company
         * @param req Express request
         * @param res Express response
         * @returns Promise<void>
         */
        this.updateCompany = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // get id from params
                const body = (0, express_validator_1.matchedData)(req);
                return yield this.service.updateCompany(res, id, body);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * list for select
         * @param req Express request
         * @param res Express response
         * @returns Promise<void>
         */
        this.listForSelect = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.service.listForSelect(res);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * List metrics data
         * @param req Express request
         * @param res Express response
         * @returns Promise<void>
         */
        this.getMetrics = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, modelId } = req.params;
                const { from, to } = req.query;
                return yield this.service.getMetrics(res, id, modelId, String(from), String(to));
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * List campains
         * @param req Express request
         * @param res Express response
         * @returns Promise<void>
         */
        this.listCampains = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                return yield this.service.listCampains(res, id);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        /**
         * List ads
         * @param req Express request
         * @param res Express response
         * @returns Promise<void>
         */
        this.listAds = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, campaigns } = req.params;
                return yield this.service.listAds(res, id, campaigns);
            }
            catch (error) {
                responseHandler_1.ResponseHandler.handleInternalError(res, error, error.message);
            }
        });
        this.service = new companies_service_1.CompaniesService();
    }
}
exports.CompaniesController = CompaniesController;
