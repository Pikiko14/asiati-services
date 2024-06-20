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
const users_model_1 = __importDefault(require("../models/users.model"));
class UserRepository {
    constructor() {
        this.model = users_model_1.default;
    }
    /**
     * Get User by Username
     * @param username String
     */
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({
                $or: [
                    { username: username },
                    { email: username }
                ]
            });
        });
    }
    /**
     * Get User by email
     * @param email String
     */
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ email });
        });
    }
    /**
     * Get User by email
     * @param token String
     */
    getUserByToken(token) {
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
     * delete user
     */
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndDelete(id);
        });
    }
    /**
     * Save user in bbdd
     * @param user User
     */
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userBd = yield this.model.create(user);
            return userBd;
        });
    }
    /**
     * Update user data
     * @param id
     * @param body
     */
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, body, { new: true });
        });
    }
    /**
     * paginate users
     * @param page
     * @param perPage
     * @param search
     */
    paginate(query, skip, perPage) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.model.find(query).skip(skip).limit(perPage);
            const totalUsers = yield this.model.find(query).countDocuments();
            return {
                data: users,
                totalItems: totalUsers
            };
        });
    }
    /**
     * get user by id
     * @param id
     */
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id);
        });
    }
    /**
     * Get all users for select
     */
    listSelect() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({}).select("id name last_name");
        });
    }
}
exports.default = UserRepository;
