"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../config/logger");
const response_1 = require("../utils/response");
const constants_1 = require("../utils/constants");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error('Unhandled error caught by middleware', err);
    return (0, response_1.sendResponse)(res, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, false, 'Internal Server Error');
};
exports.errorHandler = errorHandler;
