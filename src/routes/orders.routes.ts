import { Router } from "express";
import { upload } from "../utils/storage";
import sessionCheck from "../middlewares/session.middleware";
import { OrdersController } from "../controllers/orders.controller";
import perMissionMiddleware from "../middlewares/permission.middleware";

const router = Router();
const controller = new OrdersController();

/**
 * Import orders route
 */
router.post(
    "/import",
    sessionCheck,
    upload.single('file'),
    perMissionMiddleware("import-orders"),
    controller.importOrdersFromExcel
);

// export router
export { router };
