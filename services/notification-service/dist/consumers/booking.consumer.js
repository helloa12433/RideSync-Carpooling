"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBookingEvents = exports.startBookingConsumer = void 0;
const kafka_1 = require("../config/kafka");
const logger_1 = require("../config/logger");
const socket_gateway_1 = require("../websocket/socket.gateway");
const startBookingConsumer = async () => {
    await kafka_1.consumer.subscribe({ topic: 'booking.events', fromBeginning: false });
    logger_1.logger.info('Started Booking Consumer');
};
exports.startBookingConsumer = startBookingConsumer;
const handleBookingEvents = async (topic, partition, message) => {
    if (topic !== 'booking.events')
        return;
    try {
        const value = message.value?.toString();
        if (!value)
            return;
        const event = JSON.parse(value);
        logger_1.logger.info(`Received Booking Event: ${event.type}`, { eventId: event.id });
        // Assuming event has a userId or driverId
        const targetUserId = event.userId || event.driverId;
        if (targetUserId) {
            (0, socket_gateway_1.emitToUser)(targetUserId, 'notification:booking', event);
        }
    }
    catch (error) {
        logger_1.logger.error('Error processing booking event', error);
    }
};
exports.handleBookingEvents = handleBookingEvents;
