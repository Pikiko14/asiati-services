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
   * create new user
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

  /**
   * List all users
   */
  listUsers = async (req: Request, res: Response): Promise<void | User | any | ResponseRequestInterface>=> {
    try {
      const { page, perPage, search } = req.query as any; // get pagination data
      return await this.service.listUsers(
        res,
        page,
        perPage,
        search,
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * delete users
   */
  deleteUsers = async (req: Request, res: Response): Promise<void | User | any | ResponseRequestInterface>=> {
    try {
      const { id } = req.params as any; // get pagination data
      return await this.service.deleteUsers(
        res,
        id
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * update users
   */
  updateUsers = async (req: Request, res: Response): Promise<void | User | any | ResponseRequestInterface>=> {
    try {
      const { id } = req.params as any; // get id from params
      const body = matchedData(req) as User;
      return await this.service.updateUsers(
        res,
        id,
        body
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }
}
