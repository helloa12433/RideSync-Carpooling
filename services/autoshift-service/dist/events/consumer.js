"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startKafkaConsumer = void 0;
const kafka_1 = require("../config/kafka");
const logger_1 = require("../config/logger");
const autoshift_service_1 = require("../services/autoshift.service");
const constants_1 = require("../utils/constants");
/**
 * Maps each consumed Kafka topic to an AUTOSHIFT_REASON.
 * These events are published by Driver Service when the driver
 * reports an issue via the Emergency menu in the Driver App.
 */
const TOPIC_TO_REASON = {
    [constants_1.KAFKA_TOPICS.DRIVER_OFFLINE]: constants_1.AUTOSHIFT_REASON.DRIVER_OFFLINE,
    [constants_1.KAFKA_TOPICS.DRIVER_CANCELLED]: constants_1.AUTOSHIFT_REASON.DRIVER_CANCELLED,
    [constants_1.KAFKA_TOPICS.VEHICLE_BREAKDOWN]: constants_1.AUTOSHIFT_REASON.VEHICLE_BREAKDOWN,
    [constants_1.KAFKA_TOPICS.VEHICLE_ENGINE_FAILURE]: constants_1.AUTOSHIFT_REASON.ENGINE_FAILURE,
    [constants_1.KAFKA_TOPICS.VEHICLE_PUNCTURE]: constants_1.AUTOSHIFT_REASON.TYRE_PUNCTURE,
    [constants_1.KAFKA_TOPICS.DRIVER_ACCIDENT]: constants_1.AUTOSHIFT_REASON.DRIVER_ACCIDENT,
    [constants_1.KAFKA_TOPICS.DRIVER_EMERGENCY]: constants_1.AUTOSHIFT_REASON.DRIVER_EMERGENCY,
    [constants_1.KAFKA_TOPICS.RIDE_EMERGENCY]: constants_1.AUTOSHIFT_REASON.RIDE_EMERGENCY,
};
const startKafkaConsumer = async () => {
    try {
        // Subscribe to all driver/vehicle failure topics
        const topics = Object.keys(TOPIC_TO_REASON);
        for (const topic of topics) {
            await kafka_1.kafkaConsumer.subscribe({ topic, fromBeginning: false });
        }
        await kafka_1.kafkaConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value?.toString();
                if (!value)
                    return;
                const eventData = JSON.parse(value);
                const reason = TOPIC_TO_REASON[topic];
                logger_1.logger.info(`Received ${topic} event for ride ${eventData.rideId}, driver ${eventData.driverId}`);
                if (!eventData.rideId || !eventData.driverId) {
                    logger_1.logger.warn(`Event from ${topic} missing rideId or driverId. Skipping.`);
                    return;
                }
                // Delegate to AutoshiftService
                await autoshift_service_1.autoshiftService.handleEvent(eventData.rideId, eventData.driverId, reason);
            },
        });
        logger_1.logger.info('AutoShift Kafka consumer started successfully');
    }
    catch (error) {
        logger_1.logger.error('Error starting Kafka consumer', error);
    }
};
exports.startKafkaConsumer = startKafkaConsumer;
