"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePaymentEvents = exports.startPaymentConsumer = void 0;
const kafka_1 = require("../config/kafka");
const logger_1 = require("../config/logger");
const socket_gateway_1 = require("../websocket/socket.gateway");
const startPaymentConsumer = async () => {
    await kafka_1.consumer.subscribe({ topic: 'payment.events', fromBeginning: false });
    logger_1.logger.info('Started Payment Consumer');
};
exports.startPaymentConsumer = startPaymentConsumer;
const handlePaymentEvents = async (topic, partition, message) => {
    if (topic !== 'payment.events')
        return;
    try {
        const value = message.value?.toString();
        if (!value)
            return;
        const event = JSON.parse(value);
        logger_1.logger.info(`Received Payment Event: ${event.type}`, { eventId: event.id });
        const targetUserId = event.userId || event.driverId;
        if (targetUserId) {
            (0, socket_gateway_1.emitToUser)(targetUserId, 'notification:payment', event);
        }
    }
    catch (error) {
        logger_1.logger.error('Error processing payment event', error);
    }
};
exports.handlePaymentEvents = handlePaymentEvents;
