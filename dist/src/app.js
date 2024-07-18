"use strict";
/**
 * Main application file for the API
 */
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
exports.Server = void 0;
// Imports
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("../configuration/db"));
const express_1 = __importDefault(require("express"));
const messageBroker_1 = __importDefault(require("./utils/messageBroker"));
const rateLimiter_1 = require("./middlewares/rateLimiter");
const configuration_1 = __importDefault(require("../configuration/configuration"));
// Classes
/**
 * The main application class
 */
class Server {
    /**
     * Creates a new instance of the server
     */
    constructor() {
        this.app = (0, express_1.default)();
        // this.setupMessageBroker();
        this.PORT = parseInt(configuration_1.default.get('PORT')) || 3000; // Default port
        this.routeDirectoryPath = path_1.default.join(__dirname, './routes'); // Path to your routes directory
    }
    /**
     * Configures the middleware for the Express application
     */
    configureMiddleware() {
        const corsOptions = {
            origin: ['http://localhost:9000', 'https://financiero.asiaticorp.com'],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            optionsSuccessStatus: 204,
        };
        this.app.use((0, cors_1.default)(corsOptions));
        this.app.use(express_1.default.json());
        this.app.set('trust proxy', 1);
        this.app.use(rateLimiter_1.rateLimiter);
        this.loadRoutes();
    }
    /**
     * Loads the routes for the application
     */
    loadRoutes() {
        // Use the router
        const routes = new routes_1.default();
        routes.loadRoutes();
        this.app.use(routes.getRouter());
    }
    /**
     * Set message broker
     */
    setupMessageBroker() {
        messageBroker_1.default.connect();
    }
    /**
     * Starts the server
     */
    startServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = new db_1.default();
            yield db.connect();
            this.app.listen(this.PORT, () => console.log(`Running on port ${this.PORT}`));
        });
    }
    /**
     * Starts the server
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.configureMiddleware();
            yield this.startServer();
        });
    }
}
exports.Server = Server;
// Start the server
const server = new Server();
server.start();
