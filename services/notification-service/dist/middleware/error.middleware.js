"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../config/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error('Unhandled Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
};
exports.errorHandler = errorHandler;
