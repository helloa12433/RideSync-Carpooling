"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTrackingEvents = exports.startTrackingConsumer = void 0;
const kafka_1 = require("../config/kafka");
const logger_1 = require("../config/logger");
const socket_gateway_1 = require("../websocket/socket.gateway");
const startTrackingConsumer = async () => {
    await kafka_1.consumer.subscribe({ topic: 'tracking.events', fromBeginning: false });
    logger_1.logger.info('Started Tracking Consumer');
};
exports.startTrackingConsumer = startTrackingConsumer;
const handleTrackingEvents = async (topic, partition, message) => {
    if (topic !== 'tracking.events')
        return;
    try {
        const value = message.value?.toString();
        if (!value)
            return;
        const event = JSON.parse(value);
        logger_1.logger.info(`Received Tracking Event: ${event.type}`, { eventId: event.id });
        const targetUserId = event.userId || event.driverId;
        if (targetUserId) {
            (0, socket_gateway_1.emitToUser)(targetUserId, 'notification:tracking', event);
        }
    }
    catch (error) {
        logger_1.logger.error('Error processing tracking event', error);
    }
};
exports.handleTrackingEvents = handleTrackingEvents;
