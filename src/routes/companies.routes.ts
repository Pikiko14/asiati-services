import { Router } from "express";
import sessionCheck from "../middlewares/session.middleware";
import { CompaniesController } from "../controllers/companies.controller";
import perMissionMiddleware from "../middlewares/permission.middleware";
import { CompanyIdValidator, createCompanyValidator } from "../validators/companies.validator";

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
  createCompanyValidator,
  perMissionMiddleware("create-business"),
  controller.saveCompany
);

/**
 * Do list user
 */
router.get(
  "/",
  sessionCheck,
  perMissionMiddleware("list-business"),
  controller.listCompanies
);


/**
 * Do delete user
 */
router.delete(
  "/:id",
  CompanyIdValidator,
  sessionCheck,
  perMissionMiddleware("delete-business"),
  controller.deleteCompany
);

/**
 * Do update user
 */
router.put(
  "/:id",
  CompanyIdValidator,
  sessionCheck,
  perMissionMiddleware("edit-business"),
  createCompanyValidator,
  controller.updateCompany
);

/**
 * Do list user
 */
router.get(
  "/for-select",
  sessionCheck,
  perMissionMiddleware("list-users"),
  controller.listForSelect
);

/**
 * List metrics for one store
 */
router.get(
  '/:id/:modelId/metrics',
  CompanyIdValidator,
  sessionCheck,
  perMissionMiddleware("list-meta-metric"),
  controller.getMetrics
)

/**
 * List campains for one store
 */
router.get(
  '/:id/campaings',
  CompanyIdValidator,
  sessionCheck,
  perMissionMiddleware("list-meta-metric"),
  controller.listCampains
)

/**
 * List ads for one campaign in one store
 */
router.get(
  '/:id/:campaigns/ads',
  CompanyIdValidator,
  sessionCheck,
  perMissionMiddleware("list-meta-metric"),
  controller.listAds
)

// export router
export { router };
