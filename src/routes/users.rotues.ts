import  { Router} from "express";
import { UserController } from "../controllers/users.controller";
import {
    RegisterValidator,
} from "../validators/auth.validator";
import perMissionMiddleware from "../middlewares/permission.middleware";

// init router
const router = Router();

// instance controller
const controller = new UserController();

/**
 * Do register user
 */
router.post(
    '/',
    perMissionMiddleware('crea-un-usuario'),
    RegisterValidator,
    controller.saveUser
);

// export router
export { router };