import { Response } from "express";
import { User } from "../interfaces/users.interface";
import { ResponseHandler } from "../utils/responseHandler";
import UserRepository from "../repositories/user.repository";
import { ResponseRequestInterface } from "../interfaces/response.interface";

class UserService extends UserRepository {

  constructor() {
    super();
  }

  /**
   * Create new user
   * @param { Response } resp The response object
   * @param body The body of the request
   * @returns A Promise of 1
   */
  public async createUser(
    res: Response,
    body: User
  ): Promise<User | void | null | ResponseRequestInterface> {
    try {
      // return data
      return ResponseHandler.createdResponse(
        res,
        body,
        "User created correctly"
      );
    } catch (error: any) {
      throw error.message;
    }
  }
}

export { UserService };
