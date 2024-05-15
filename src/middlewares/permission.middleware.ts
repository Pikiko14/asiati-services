
import { NextFunction, Response } from "express";
import { User } from "../interfaces/users.interface";
import { ResponseHandler } from "../utils/responseHandler";

// middleare permission
const perMissionMiddleware = (scope: string) => {
    return (req: any, res: Response, next: NextFunction) => {
      try {
        const { scopes } = req.user as User; // obtenemos los scopes del usuario que hace la peticion.
        if (scopes && scopes.length > 0) {
            if (!scopes.includes(scope)) { // si el usuario no cuenta con el permiso de ver el recurso
                return ResponseHandler.handleUnauthorized(res, {}, "Don´t have permission for do this action.");
            }
            next(); // pasa la peticion normal.
        } else {
          // El usuario no tiene el permiso, devuelve una respuesta de no autorizado
          return ResponseHandler.handleDenied(res, {}, "Don´t have permission for do this action.");
        }
      } catch (e) {
        return ResponseHandler.handleUnprocessableEntity(res, {}, "Error on permission valdiations.");
      }
    };
};

export default perMissionMiddleware;