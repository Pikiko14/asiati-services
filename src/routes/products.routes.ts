import { Router } from "express";
import sessionCheck from "../middlewares/session.middleware";
import { ProductsController } from "../controllers/products.controller";
import perMissionMiddleware from "../middlewares/permission.middleware";
import { productsCreationValidator, ProductsIdValidator } from "../validators/products.validator";

const router = Router();
const controller = new ProductsController();

/**
 * Create products
 */
router.post(
  "/",
  sessionCheck,
  perMissionMiddleware("create-products"),
  productsCreationValidator,
  controller.createProducts
);

/**
 * list products
 */
router.get(
  "/",
  sessionCheck,
  perMissionMiddleware("list-products"),
  controller.listProducts
);

/**
 * Delete products
 */
router.delete(
  "/:id",
  sessionCheck,
  perMissionMiddleware("delete-products"),
  ProductsIdValidator,
  controller.deleteProducts
);

/**
 * Update products
 */
router.put(
  "/:id",
  sessionCheck,
  perMissionMiddleware("edit-products"),
  ProductsIdValidator,
  productsCreationValidator,
  controller.updateProducts
);

// export router
export { router };
