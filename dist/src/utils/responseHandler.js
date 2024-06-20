"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
const winston_1 = require("winston");
class ResponseHandler {
    /**
     * Maneja respuestas safistactorias (200)
     * @param res El objeto de respuesta de Express
     * @param data Los datos relacionados a la respuesta
     * @param message El mensaje de respuesta
     */
    static successResponse(res, data, message) {
        res.status(200).json({
            success: true,
            data,
            message,
        });
    }
    /**
     * Maneja respuestas de creacion (200)
     * @param res El objeto de respuesta de Express
     * @param data Los datos relacionados con la creacion
     * @param message El mensaje de creacion
     */
    static createdResponse(res, data, message) {
        res.status(201).json({
            success: true,
            data,
            message,
        });
    }
    /**
     * Maneja un error interno del servidor (500)
     * @param res El objeto de respuesta de Express
     * @param data Los datos relacionados con el error
     * @param message El mensaje de error
     */
    static handleInternalError(res, data, message) {
        this.logger.error(message, { error: data }); // Registrar el error en los registros de Winston
        res.status(500).json({
            error: true,
            data,
            message,
        });
    }
    /**
     * Maneja un error de recurso no encontrado (404)
     * @param res El objeto de respuesta de Express
     * @param data Los datos relacionados con el error
     * @param message El mensaje de error
     */
    static handleNotFound(res, data, message) {
        res.status(404).json({
            error: true,
            data,
            message,
        });
    }
    /**
     * Maneja un error de solicitud no válida (422)
     * @param res El objeto de respuesta de Express
     * @param data Los datos relacionados con el error
     * @param message El mensaje de error
     */
    static handleUnprocessableEntity(res, data, message) {
        res.status(422).json({
            error: true,
            data,
            message,
        });
    }
    /**
     * Maneja un error de autenticación (401)
     * @param res El objeto de respuesta de Express
     * @param data Los datos relacionados con el error
     * @param message El mensaje de error
     */
    static handleUnauthorized(res, data, message) {
        res.status(401).json({
            error: true,
            data,
            message,
        });
    }
    /**
     * Maneja un error de acceso denegado (403)
     * @param res El objeto de respuesta de Express
     * @param data Los datos relacionados con el error
     * @param message El mensaje de error
     */
    static handleDenied(res, data, message) {
        res.status(403).json({
            error: true,
            data,
            message,
        });
    }
}
exports.ResponseHandler = ResponseHandler;
ResponseHandler.logger = (0, winston_1.createLogger)({
    level: "error",
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: "error.log", level: "error" }),
    ],
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
});
