"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const response_1 = require("../utils/response");
const constants_1 = require("../utils/constants");
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ');
            return (0, response_1.sendResponse)(res, constants_1.HTTP_STATUS.BAD_REQUEST, false, errorMessage);
        }
        next();
    };
};
exports.validateRequest = validateRequest;
