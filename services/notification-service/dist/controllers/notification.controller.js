"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushTestNotification = void 0;
const socket_gateway_1 = require("../websocket/socket.gateway");
const response_1 = require("../utils/response");
const logger_1 = require("../config/logger");
const pushTestNotification = async (req, res) => {
    try {
        const { userId, eventName, payload } = req.body;
        (0, socket_gateway_1.emitToUser)(userId, eventName, payload);
        return (0, response_1.successResponse)(res, 200, 'Test notification pushed successfully');
    }
    catch (error) {
        logger_1.logger.error('Error pushing test notification', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.pushTestNotification = pushTestNotification;
