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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class RoutesIndex
 * @description This class is responsible for loading all routes in the application
 * @author Johnny Ray Ramirez <jramirez-dev@hotmail.com>
 */
const express_1 = require("express");
const fs_1 = require("fs");
const utils_1 = require("../utils/utils");
class RoutesIndex {
    /**
     * Constructor of the class
     */
    constructor() {
        this.router = (0, express_1.Router)();
        this.PATH_ROUTER = `${__dirname}`;
        this.utils = new utils_1.Utils();
    }
    /**
     * Function that loads all routes
     */
    loadRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, fs_1.readdirSync)(this.PATH_ROUTER).filter((fileName) => {
                if (fileName !== "index.ts") {
                    const nameFile = this.utils.splitFile(fileName, ".");
                    Promise.resolve(`${`./${nameFile}.routes`}`).then(s => __importStar(require(s))).then((moduleRouter) => {
                        console.log(`Loading ${nameFile} routers`);
                        this.router.use(`/api/v1/${nameFile}`, moduleRouter.router);
                    });
                }
            });
        });
    }
    /**
     * Function that returns the router
     */
    getRouter() {
        return this.router;
    }
}
exports.default = RoutesIndex;
