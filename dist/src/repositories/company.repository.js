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
const companies_model_1 = __importDefault(require("../models/companies.model"));
class CompaniesRepository {
    constructor() {
        this.model = companies_model_1.default;
    }
    /**
     * Get Company by name
     * @param name String
     */
    getCompanyByCompanyName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({
                $or: [
                    { name: name },
                ]
            });
        });
    }
    /**
     * Get Company by email
     * @param email String
     */
    getCompanyByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ email });
        });
    }
    /**
     * Get Company by email
     * @param token String
     */
    getCompanyByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({
                $or: [
                    { confirmation_token: token },
                    { recovery_token: token }
                ]
            });
        });
    }
    /**
     * delete Company
     */
    deleteCompanyBd(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndDelete(id);
        });
    }
    /**
     * Save Company in bbdd
     * @param Company Company
     */
    create(company) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyBd = yield this.model.create(company);
            return companyBd;
        });
    }
    /**
     * Update Company data
     * @param id
     * @param body
     */
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, body, { new: true });
        });
    }
    /**
     * paginate Companys
     * @param page
     * @param perPage
     * @param search
     */
    paginate(query, skip, perPage) {
        return __awaiter(this, void 0, void 0, function* () {
            const companys = yield this.model.find(query)
                .skip(skip)
                .limit(perPage)
                .populate('responsable');
            const totalCompanys = yield this.model.find(query).countDocuments();
            return {
                data: companys,
                totalItems: totalCompanys
            };
        });
    }
    /**
     * get Company by id
     * @param id
     */
    getCompanyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id).populate('responsable');
        });
    }
    /**
     * Get all Companys for select
     */
    listSelect() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({}).select("id name");
        });
    }
}
exports.default = CompaniesRepository;
