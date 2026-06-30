"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAutoShiftEvents = exports.startAutoShiftConsumer = void 0;
const kafka_1 = require("../config/kafka");
const logger_1 = require("../config/logger");
const socket_gateway_1 = require("../websocket/socket.gateway");
const startAutoShiftConsumer = async () => {
    await kafka_1.consumer.subscribe({ topic: 'autoshift.events', fromBeginning: false });
    logger_1.logger.info('Started AutoShift Consumer');
};
exports.startAutoShiftConsumer = startAutoShiftConsumer;
const handleAutoShiftEvents = async (topic, partition, message) => {
    if (topic !== 'autoshift.events')
        return;
    try {
        const value = message.value?.toString();
        if (!value)
            return;
        const event = JSON.parse(value);
        logger_1.logger.info(`Received AutoShift Event: ${event.type}`, { eventId: event.id });
        // AutoShift might notify both the passenger and the new driver
        if (event.userId) {
            (0, socket_gateway_1.emitToUser)(event.userId, 'notification:autoshift', event);
        }
        if (event.driverId) {
            (0, socket_gateway_1.emitToUser)(event.driverId, 'notification:autoshift', event);
        }
    }
    catch (error) {
        logger_1.logger.error('Error processing autoshift event', error);
    }
};
exports.handleAutoShiftEvents = handleAutoShiftEvents;
