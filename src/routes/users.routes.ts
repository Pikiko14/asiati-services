import  { Router} from "express";
import {
    RegisterValidator,
} from "../validators/auth.validator";
import sessionCheck from "../middlewares/session.middleware";
import { UserController } from "../controllers/users.controller";
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
    sessionCheck,
    perMissionMiddleware('create-users'),
    RegisterValidator,
    controller.saveUser
);

// export router
export { router };