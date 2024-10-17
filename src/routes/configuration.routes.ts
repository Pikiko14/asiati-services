import { Router } from "express";
import sessionCheck from "../middlewares/session.middleware";
import perMissionMiddleware from "../middlewares/permission.middleware";
import { ConfigurationController } from "./../controllers/configuration.controller";
import { ConfigurationCreation } from "../validators/configuration.validator";

// init router
const router = Router();

// instance controller
const controller = new ConfigurationController();

/**
 * Do register user
 */
router.post(
  "/",
  sessionCheck,
  perMissionMiddleware("create-configuration"),
  ConfigurationCreation,
  controller.saveConfiguration
);

/**
 * Do register user
 */
router.get(
  "/",
  sessionCheck,
  perMissionMiddleware("list-configuration"),
  controller.getConfiguration
);

// export router
export { router };
