import { Router } from "express";
import { upload } from "../utils/storage";
import sessionCheck from "../middlewares/session.middleware";
import { OrdersController } from "../controllers/orders.controller";
import perMissionMiddleware from "../middlewares/permission.middleware";
import { OrdersImportValidator } from "../validators/orders.validator";

const router = Router();
const controller = new OrdersController();

/**
 * Import orders route
 */
router.post(
    "/import",
    sessionCheck,
    perMissionMiddleware("import-orders"),
    upload.single('file'),
    OrdersImportValidator,
    controller.importOrdersFromExcel
);

// export router
export { router };
