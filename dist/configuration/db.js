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
const mongoose_1 = require("mongoose");
const configuration_1 = __importDefault(require("./configuration"));
class Database {
    constructor() {
        this.DB_URI = configuration_1.default.get('APP_ENV') === 'develop' ? configuration_1.default.get('DB_URL') : configuration_1.default.get('MONGO_ATLAS_URL');
        this.connection = null;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = (yield (0, mongoose_1.connect)(this.DB_URI));
                ;
                console.log("Conexión a la base de datos establecida correctamente.");
            }
            catch (error) {
                console.error("Error al conectar con la base de datos:", error);
                throw error; // Lanzar el error para que el usuario pueda manejarlo
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.connection) {
                    yield this.connection.disconnect();
                    console.log("Conexión a la base de datos cerrada correctamente.");
                }
            }
            catch (error) {
                console.error("Error al cerrar la conexión con la base de datos:", error);
                throw error; // Lanzar el error para que el usuario pueda manejarlo
            }
        });
    }
}
exports.default = Database;
