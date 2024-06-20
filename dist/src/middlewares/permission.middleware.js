"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler_1 = require("../utils/responseHandler");
// middleare permission
const perMissionMiddleware = (scope) => {
    return (req, res, next) => {
        try {
            const { scopes } = req.user; // obtenemos los scopes del usuario que hace la peticion.
            if (scopes && scopes.length > 0) {
                if (!scopes.includes(scope)) { // si el usuario no cuenta con el permiso de ver el recurso
                    return responseHandler_1.ResponseHandler.handleDenied(res, {}, "No cuentas con el permiso para realizar esta acción.");
                }
                next(); // pasa la peticion normal.
            }
            else {
                // El usuario no tiene el permiso, devuelve una respuesta de no autorizado
                return responseHandler_1.ResponseHandler.handleDenied(res, {}, "No cuentas con el permiso para realizar esta acción.");
            }
        }
        catch (e) {
            return responseHandler_1.ResponseHandler.handleUnprocessableEntity(res, {}, "Error valdiando los permisos del usuario.");
        }
    };
};
exports.default = perMissionMiddleware;
