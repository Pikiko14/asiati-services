import { Router } from "express";
import { RegisterValidator } from "../validators/auth.validator";
import sessionCheck from "../middlewares/session.middleware";
import { UserController } from "../controllers/users.controller";
import perMissionMiddleware from "../middlewares/permission.middleware";
import { UserIdValidator, UpdateUserValidator } from "../validators/users.validator";

// init router
const router = Router();

// instance controller
const controller = new UserController();

/**
 * Do create user
 */
router.post(
  "/",
  sessionCheck,
  perMissionMiddleware("create-users"),
  RegisterValidator,
  controller.saveUser
);

/**
 * Do list user
 */
router.get(
  "/",
  sessionCheck,
  perMissionMiddleware("list-users"),
  controller.listUsers
);


/**
 * Do delete user
 */
router.delete(
  "/:id",
  UserIdValidator,
  sessionCheck,
  perMissionMiddleware("delete-users"),
  controller.deleteUsers
);

/**
 * Do update user
 */
router.put(
  "/:id",
  UserIdValidator,
  sessionCheck,
  perMissionMiddleware("edit-users"),
  UpdateUserValidator,
  controller.updateUsers
);

// export router
export { router };
