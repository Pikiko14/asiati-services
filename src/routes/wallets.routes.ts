import { Router } from "express";
import { upload } from "../utils/storage";
import sessionCheck from "../middlewares/session.middleware";
import { WalletsController } from "../controllers/wallets.controller";
import perMissionMiddleware from "../middlewares/permission.middleware";
import { OrdersImportValidator } from "../validators/orders.validator";

const router = Router();
const controller = new WalletsController();

/**
 * Import orders route
 */
router.post(
    "/import",
    sessionCheck,
    perMissionMiddleware("create-wallet"),
    upload.single('file'),
    OrdersImportValidator,
    controller.importWalletsFromExcel
);

/**
 * Import orders route
 */
router.get(
    "/",
    sessionCheck,
    perMissionMiddleware("list-wallet"),
    controller.listWallets
);

// export router
export { router };
