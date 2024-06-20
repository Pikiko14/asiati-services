"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerValidator = void 0;
const responseHandler_1 = require("./responseHandler");
const express_validator_1 = require("express-validator");
const handlerValidator = (req, res, next) => {
    try {
        (0, express_validator_1.validationResult)(req).throw();
        return next();
    }
    catch (error) {
        return responseHandler_1.ResponseHandler.handleUnprocessableEntity(res, error.array(), "Error request body");
    }
};
exports.handlerValidator = handlerValidator;
