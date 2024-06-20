"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
class Configuration {
    constructor() {
        // Cargar las variables de entorno desde el archivo .env
        dotenv_1.default.config();
        this.envConfig = process.env;
    }
    get(key) {
        // Obtener el valor de una variable de entorno específica
        return this.envConfig[key];
    }
}
// Exportar una instancia única del objeto Configuration
exports.default = new Configuration();
