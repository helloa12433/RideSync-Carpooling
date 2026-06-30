"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const socket_gateway_1 = require("../websocket/socket.gateway");
const logger_1 = require("../config/logger");
const sendNotification = (userId, eventName, payload) => {
    logger_1.logger.info(`Processing notification for user ${userId}`);
    (0, socket_gateway_1.emitToUser)(userId, eventName, payload);
};
exports.sendNotification = sendNotification;
