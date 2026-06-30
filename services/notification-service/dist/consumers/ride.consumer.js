"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRideEvents = exports.startRideConsumer = void 0;
const kafka_1 = require("../config/kafka");
const logger_1 = require("../config/logger");
const socket_gateway_1 = require("../websocket/socket.gateway");
const startRideConsumer = async () => {
    await kafka_1.consumer.subscribe({ topic: 'ride.created', fromBeginning: false });
    await kafka_1.consumer.subscribe({ topic: 'ride.status.updated', fromBeginning: false });
    logger_1.logger.info('Started Ride Consumer for ride.created and ride.status.updated');
};
exports.startRideConsumer = startRideConsumer;
const handleRideEvents = async (topic, partition, message) => {
    if (topic !== 'ride.created' && topic !== 'ride.status.updated')
        return;
    try {
        const value = message.value?.toString();
        if (!value)
            return;
        const event = JSON.parse(value);
        // Explicitly log every consumed message to terminal as requested
        console.log(`[KAFKA CONSUMER] Notification Service consumed event from topic ${topic}:`, event);
        logger_1.logger.info(`Received Ride Event from ${topic}`, { eventId: event.id || event.ride_id });
        // RIDE_CREATED notification
        if (topic === 'ride.created') {
            const driverId = event.driver_id;
            if (driverId) {
                (0, socket_gateway_1.emitToUser)(driverId, 'notification:ride', { type: 'RIDE_CREATED', message: 'Your ride has been created successfully.', data: event });
            }
        }
        // RIDE_STATUS_UPDATED notification
        if (topic === 'ride.status.updated') {
            // In a real app, we might look up the driver/passenger ID based on ride_id if not included
            if (event.status === 'PUBLISHED') {
                (0, socket_gateway_1.emitToUser)(event.driver_id, 'notification:ride', { type: 'RIDE_PUBLISHED', message: 'Your ride is now live and searchable.', data: event });
            }
        }
    }
    catch (error) {
        logger_1.logger.error('Error processing ride event in notification service', error);
    }
};
exports.handleRideEvents = handleRideEvents;
