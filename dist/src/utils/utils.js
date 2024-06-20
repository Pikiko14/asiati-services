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
exports.Utils = void 0;
const fs_1 = __importDefault(require("fs"));
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcryptjs"));
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = require("jsonwebtoken");
const configuration_1 = __importDefault(require("../../configuration/configuration"));
class Utils {
    constructor() {
        this.JWT_SECRET = "";
        this.salt = 0;
        /**
         * generate sesion token.
         * @param {string} id
         * @param {string} name
         */
        this.generateToken = (_a) => __awaiter(this, [_a], void 0, function* ({ name, scopes, _id, role, last_name, email }) {
            const jwt = yield (0, jsonwebtoken_1.sign)({ _id, name, scopes, role, last_name, email }, this.JWT_SECRET, {
                expiresIn: "1d",
            });
            return jwt;
        });
        /**
         * verify session token
         * @param {string} token
         */
        this.verifyToken = (token) => __awaiter(this, void 0, void 0, function* () {
            const isOk = yield (0, jsonwebtoken_1.verify)(token, this.JWT_SECRET);
            return isOk;
        });
        /**
         * Generate password encrypt
         * @param {string} password
         */
        this.encryptPassword = (password) => __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt.hash(password, this.salt);
            return hashedPassword;
        });
        /**
         * Comapre user password
         * @param {string} userPassword user bd password
         * @param {string} loginPassword // form password
         */
        this.comparePassword = (userPassword, loginPassword) => __awaiter(this, void 0, void 0, function* () {
            const compare = yield bcrypt.compare(loginPassword, userPassword);
            if (!compare)
                return false;
            return true;
        });
        /**
         * Get current date
         */
        this.getCurrentDate = () => {
            const currentDate = new Date();
            // Get the day, month, and year
            const day = String(currentDate.getDate()).padStart(2, "0");
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const year = currentDate.getFullYear();
            // Format the date in "dd-mm-yyyy" format
            const formattedDate = `${day}-${month}-${year}`;
            return formattedDate;
        };
        /**
         * Format date to YYYY-MM-DD
         * @param {Date} date
         */
        this.formatDate = (date) => {
            return date.toISOString().split("T")[0];
        };
        /**
         * get path from storage
         * @param {string} path
         */
        this.getPath = (path) => __awaiter(this, void 0, void 0, function* () {
            if (path.includes("catalogues")) {
                yield this.validateOrGeneratePath("catalogues");
                return "catalogues";
            }
            if (path.includes("pdf")) {
                yield this.validateOrGeneratePath("pdfs");
                return "pdfs";
            }
            if (path.includes("images")) {
                yield this.validateOrGeneratePath(path);
                return path;
            }
            if (path.includes("pages")) {
                yield this.validateOrGeneratePath("images");
                return "images";
            }
            if (path.includes("profile")) {
                yield this.validateOrGeneratePath("profile");
                return "profile";
            }
            if (path.includes("products")) {
                yield this.validateOrGeneratePath("products");
                return "products";
            }
            if (path.includes("categories")) {
                yield this.validateOrGeneratePath("categories");
                return "categories";
            }
            return undefined;
        });
        this.validateOrGeneratePath = (path) => __awaiter(this, void 0, void 0, function* () {
            const directory = `${this.path}/${path}`;
            const isDirectoryExist = yield fs_1.default.existsSync(directory);
            if (!isDirectoryExist) {
                fs_1.default.mkdirSync(directory);
            }
        });
        /**
         * Delete file from storage
         * @param {string} path
         */
        this.deleteItemFromStorage = (path) => __awaiter(this, void 0, void 0, function* () {
            const directory = `${this.path}/${path}`;
            const isDirectoryExist = yield fs_1.default.existsSync(directory);
            if (isDirectoryExist) {
                yield fs_1.default.unlinkSync(directory);
            }
        });
        /**
         * Generate date
         * @returns { string }
         */
        this.getDate = () => {
            const now = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
            return now;
        };
        /**
         * Get date from string
         * @param {string} date
         * @returns { string }
         */
        this.getDateFromString = (date) => {
            const now = (0, moment_1.default)(date).format("YYYY-MM-DD HH:mm:ss");
            return now;
        };
        /**
         * add some time to current date
         * @param { Date } date
         * @param { string } typeAdd
         * @param { string } timeToAdd
         */
        this.sumTimeToDate = (date, typeAdd, timeToAdd) => {
            const currentDate = (0, moment_1.default)(date);
            // Add one day to the current date
            const futureDate = currentDate.add(timeToAdd, typeAdd);
            const dateReturn = futureDate.format("YYYY-MM-DD HH:mm:ss");
            return dateReturn;
        };
        /**
         * do hash for epayco
         * @param { string } chainText
         */
        this.doHash = (chainText) => __awaiter(this, void 0, void 0, function* () {
            const signature = yield crypto
                .createHash("sha256")
                .update(chainText)
                .digest("hex");
            return signature;
        });
        /**
         * generate token for recovery password.
         * @param {string} id
         * @param {string} name
         */
        this.generateTokenForRecoveryPassword = (_b) => __awaiter(this, [_b], void 0, function* ({ email }) {
            const jwt = yield (0, jsonwebtoken_1.sign)({ email }, this.JWT_SECRET, {
                expiresIn: "30m",
            });
            return jwt;
        });
        this.JWT_SECRET = configuration_1.default.get("JWT_SECRET") || "";
        this.salt = 10;
        this.path = `${process.cwd()}/uploads/`;
    }
    /**
     * split file by delimiter
     * @param {string} file
     * @param {string} delimiter
     * @returns {string}
     */
    splitFile(file, delimiter) {
        const nameFile = file.split(delimiter).shift();
        return nameFile;
    }
}
exports.Utils = Utils;
