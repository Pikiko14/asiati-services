import { Response } from "express";
import { Utils } from "../utils/utils";
import { User } from "../interfaces/users.interface";
import { EmailSenderService } from "./email.service";
import { ResponseHandler } from "../utils/responseHandler";
import UserRepository from "../repositories/user.repository";
import { ResponseRequestInterface } from "../interfaces/response.interface";
import { MessageBrokerInterface, TypeNotification } from "../interfaces/broker.interface";

class UserService extends UserRepository {
  private utils: Utils;
  private emailSender: EmailSenderService;

  constructor() {
    super();
    this.utils = new Utils();
    this.emailSender = new EmailSenderService();
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
      // set password
      body.password = await this.utils.encryptPassword(body.password);
      body.is_active = true;

      // create user on bbdd
      const user: any = await this.create(body);

      // set token recovery valid by 1d
      user.confirmation_token = await this.utils.generateToken(user);
      await this.update(user.id, user);

      // push notification queue
      const message: MessageBrokerInterface = {
        data: {
          name: user.name,
          last_name: user.last_name,
          email: user.email,
          token: user.confirmation_token,
          recovery_token: user.recovery_token,
        },
        type_notification: TypeNotification.EMAIL,
        template: "welcome",
      }
      // await this.emailSender.sendMessage(message); // validar si se debe activar el envio de correo desde aca

      // return data
      return ResponseHandler.createdResponse(
        res,
        user,
        "Usuario creado correctamente."
      );
    } catch (error: any) {
      throw error.message;
    }
  }
}

export { UserService };