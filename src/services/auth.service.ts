import { Response } from "express";
import { Utils } from "../utils/utils";
import { User } from "../interfaces/users.interface";
import { EmailSenderService } from "../services/email.service";
import { ResponseHandler } from "../utils/responseHandler";
import UserRepository from "../repositories/users.repository";
import { MessageBrokerInterface, TypeNotification } from "../interfaces/broker.interface";

class AuthService extends UserRepository {
  private utils: Utils;
  private scopes: string[] = [];
  private emailSender: EmailSenderService;

  constructor() {
    super();
    this.utils = new Utils();
    this.scopes = [
      'create-users',
      'list-users',
      'edit-users',
      'delete-users',
      'create-business',
      'list-business',
      'edit-business',
      'delete-business',
      'list-meta-metric',
      'list-orders',
      'import-orders',
      'create-products',
      'list-products',
      'edit-products',
      'delete-products',
      'create-wallet',
      'list-wallet',
      'edit-wallet',
      'delete-wallet',
      'create-configuration',
      'list-configuration',
      'edit-configuration',
      'delete-configuration',
      'create-expenses',
      'list-expenses',
      'edit-expenses',
      'delete-expenses',
    ];
    this.emailSender = new EmailSenderService();
  }

  /**
   * Register new user
   * @param { Response } resp The response object
   * @param body The body of the request
   * @returns A Promise of 1
   */
  public async registerUser(
    res: Response,
    body: User
  ): Promise<User | void | null> {
    try {
      // set password
      body.password = await this.utils.encryptPassword(body.password as string);
      body.scopes = this.scopes;
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
      await this.emailSender.sendMessage(message);

      // return data
      return ResponseHandler.createdResponse(
        res,
        user,
        "User registered correctly"
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * User confirmation
   * @param { Response } resp The response object
   * @param token The token of the request
   * @param action The action of the request
   */
  public async userConfirmation(
    res: Response,
    token: string,
    action: string
  ): Promise<void> {
    try {
      // get user and validate
      const user: any = await this.getUserByToken(token);

      // validate action
      let message: string = "";

      // unsuscribe
      if (user && user.id && action === "unsubscribe") {
        await this.deleteUser(user.id);
        message = "User unsubscribe correctly";
      }

      // do user confirmation
      if (user && user.id && action === "confirm-account" && user.confirmation_token === token) {
        const verifyToken = await this.utils.verifyToken(token)
        if (verifyToken) {
          user.is_active = true;
          user.confirmation_token = null;
          await this.update(user.id, user);
          message = "User confirmed correctly";
        } else {
          await this.deleteUser(user.id);
          message = "Token expired, user confirmation failed";
        }
      }

      // return response
      return ResponseHandler.successResponse(res, user, message);
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * User login
   * @param { Response } res The response object
   * @param body The body of the request
   */
  public async login(res: Response, body: User): Promise<void> {
    try {
      const user = await this.getUserByUsername(body.username);
      // if user exists
      if (user) {
        // compare password
        const comparePassword = await this.utils.comparePassword(
          user.password as string,
          body.password as string,
        )
        if (comparePassword) {
          const token = await this.utils.generateToken(user);
          return ResponseHandler.successResponse(res, { user, token }, "Has iniciado sesión correctamente");
        } else {
          throw new Error("Contraseña incorrecta");
        }
      } else {
        throw new Error("Contraseña incorrecta");
      }
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * User recovery
   * @param { Response } res The response object
   * @param body The body of the request
   */
  public async recovery(res: Response, body: User): Promise<void> {
    try {
      // generate recovery toke
      const { email } = body;
      const user: any = await this.getUserByUsername(email) as User;
      if (user) {
        // generate token recovery
        const token: string = await this.utils.generateTokenForRecoveryPassword({email});
        user.recovery_token = token;
        await user.save();

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
          template: "recovery",
          subject: "Recovery password",
          to: email
        }
        await this.emailSender.sendMessage(message);
      }
      
      // return response
      return ResponseHandler.successResponse(
        res,
        { token: user.recovery_token },
        "Se ha enviado un correo electrónico con las instrucciones para restablecer su contraseñas"
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * User change password
   * @param { Response } res The response object
   * @param body The body of the request
   */
  public async changePassword(res: Response, body: User): Promise<void> {
    try {
      // get user
      const user: any = await this.getUserByToken(body.token as string);
      if (user) {
        // set new password
        user.recovery_token = null;
        user.password = await this.utils.encryptPassword(body.password as string);
        await this.update(user.id, user);
        return ResponseHandler.successResponse(res, user, "Contraseña cambiada correctamente");
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      throw error.message;
    }
  }
}

export { AuthService };
