import { Router } from "express";
import sessionCheck from "../middlewares/session.middleware";
import { ExpensesCreation } from "../validators/expenses.validator";

import perMissionMiddleware from "../middlewares/permission.middleware";
import { ExpensesController } from "../controllers/expenses.controller";

// init router
const router = Router();

// instance controller
const controller = new ExpensesController();

/**
 * Do register expenses
 */
router.post(
  "/",
  sessionCheck,
  perMissionMiddleware("create-expenses"),
  ExpensesCreation,
  controller.saveExpenses
);

/**
 * Do list expenses
 */
router.get(
  "/",
  sessionCheck,
  perMissionMiddleware("list-expenses"),
  controller.listExpenses
);

// export router
export { router };
