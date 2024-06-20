"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_validator_1 = require("../validators/auth.validator");
const session_middleware_1 = __importDefault(require("../middlewares/session.middleware"));
const users_controller_1 = require("../controllers/users.controller");
const permission_middleware_1 = __importDefault(require("../middlewares/permission.middleware"));
const users_validator_1 = require("../validators/users.validator");
// init router
const router = (0, express_1.Router)();
exports.router = router;
// instance controller
const controller = new users_controller_1.UserController();
/**
 * Do create user
 */
router.post("/", session_middleware_1.default, (0, permission_middleware_1.default)("create-users"), auth_validator_1.RegisterValidator, controller.saveUser);
/**
 * Do list user
 */
router.get("/", session_middleware_1.default, (0, permission_middleware_1.default)("list-users"), controller.listUsers);
/**
 * Do delete user
 */
router.delete("/:id", users_validator_1.UserIdValidator, session_middleware_1.default, (0, permission_middleware_1.default)("delete-users"), controller.deleteUsers);
/**
 * Do update user
 */
router.put("/:id", users_validator_1.UserIdValidator, session_middleware_1.default, (0, permission_middleware_1.default)("edit-users"), users_validator_1.UpdateUserValidator, controller.updateUsers);
/**
 * Do list user
 */
router.get("/for-select", session_middleware_1.default, (0, permission_middleware_1.default)("list-users"), controller.listForSelect);
