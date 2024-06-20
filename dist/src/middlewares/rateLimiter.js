"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
// src/middleware/rateLimiter.ts
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 15 minutos
    max: 50, // Limite cada IP a 100 peticiones por ventana de 15 minutos
    message: 'Muchas peticiones. Por favor, espere 1 minuto',
    headers: true, // Añade información en los headers
});
