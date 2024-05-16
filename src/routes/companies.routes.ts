import { Router } from "express";
import sessionCheck from "../middlewares/session.middleware";
import { CompaniesController } from "../controllers/companies.controller";
import perMissionMiddleware from "../middlewares/permission.middleware";

// init router
const router = Router();

// instance controller
const controller = new CompaniesController();

/**
 * Do create user
 */
router.post(
  "/",
  sessionCheck,
  perMissionMiddleware("create-business"),
  controller.saveCompany
);

// export router
export { router };
