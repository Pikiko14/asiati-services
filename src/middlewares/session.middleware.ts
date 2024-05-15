import { Utils } from "../utils/utils";
import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";

// instances
const utils = new Utils();

const sessionCheck = async (req: any, res: Response, next: NextFunction) => {
  try {
    const jwtByUser = req.headers.authorization || "";
    const jwt = jwtByUser.split(" ").pop();
    const isUser = await utils.verifyToken(`${jwt}`) as { id: string };
    if (!isUser) {
      return ResponseHandler.handleUnauthorized(res, {}, "Necesitas iniciar sesión para continuar");
    } else {
      req.user = isUser;
      next();
    }
  } catch (e) {
    return ResponseHandler.handleUnauthorized(res, {}, "No has iniciado sesión aun.");
  }
};

export default sessionCheck;