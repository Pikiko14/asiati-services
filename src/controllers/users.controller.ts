import { Request, Response } from "express";
import { matchedData } from 'express-validator';
import { User } from "../interfaces/users.interface";
import { UserService } from "../services/users.service";
import { ResponseHandler } from "../utils/responseHandler";
import { ResponseRequestInterface } from "../interfaces/response.interface";

export class UserController {
  public service: UserService;

  constructor() {
    this.service = new UserService()
  }

  /**
   * Register new user
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  saveUser = async (req: Request, res: Response): Promise<void | User | null | ResponseRequestInterface>  => {
    try {
      const body = matchedData(req) as User;
      return await this.service.createUser(res, body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }
}
