"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const logger_1 = require("../config/logger");
const response_1 = require("../utils/response");
const constants_1 = require("../utils/constants");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger_1.logger.warn('Unauthorized access attempt: No token provided');
            return (0, response_1.sendResponse)(res, constants_1.HTTP_STATUS.UNAUTHORIZED, false, 'Unauthorized: No token provided');
        }
        const userId = req.headers['x-user-id'];
        const userRole = req.headers['x-user-role'];
        if (!userId) {
            logger_1.logger.warn('Unauthorized access attempt: Invalid token payload');
            return (0, response_1.sendResponse)(res, constants_1.HTTP_STATUS.UNAUTHORIZED, false, 'Unauthorized: Invalid token');
        }
        req.user = {
            id: userId,
            role: userRole || 'USER',
        };
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication error', error);
        return (0, response_1.sendResponse)(res, constants_1.HTTP_STATUS.UNAUTHORIZED, false, 'Unauthorized');
    }
};
exports.authMiddleware = authMiddleware;
