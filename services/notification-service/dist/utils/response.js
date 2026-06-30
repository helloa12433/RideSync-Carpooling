"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};
exports.successResponse = successResponse;
const errorResponse = (res, statusCode, message, errors) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};
exports.errorResponse = errorResponse;
