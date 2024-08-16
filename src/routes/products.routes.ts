import { Router } from "express";
import sessionCheck from "../middlewares/session.middleware";
import { ProductsController } from "../controllers/products.controller";
import perMissionMiddleware from "../middlewares/permission.middleware";
import { productsCreationValidator } from "../validators/products.validator";

const router = Router();
const controller = new ProductsController();

/**
 * Import orders route
 */
router.post(
  "/",
  sessionCheck,
  perMissionMiddleware("create-products"),
  productsCreationValidator,
  controller.createProducts
);

// export router
export { router };
