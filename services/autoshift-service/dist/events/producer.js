"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishAutoshiftFailedEvent = exports.publishAutoshiftCompletedEvent = exports.publishRideTransferredEvent = exports.publishDriverReplacedEvent = exports.publishAutoshiftStartedEvent = void 0;
const kafka_1 = require("../config/kafka");
const logger_1 = require("../config/logger");
const constants_1 = require("../utils/constants");
const publishAutoshiftStartedEvent = async (data) => {
    try {
        await kafka_1.kafkaProducer.send({
            topic: constants_1.KAFKA_TOPICS.AUTOSHIFT_STARTED,
            messages: [{ value: JSON.stringify(data) }],
        });
        logger_1.logger.info(`Event published to ${constants_1.KAFKA_TOPICS.AUTOSHIFT_STARTED}`, { autoshiftId: data.autoshiftId });
    }
    catch (error) {
        logger_1.logger.error(`Failed to publish ${constants_1.KAFKA_TOPICS.AUTOSHIFT_STARTED}`, error);
    }
};
exports.publishAutoshiftStartedEvent = publishAutoshiftStartedEvent;
const publishDriverReplacedEvent = async (data) => {
    try {
        await kafka_1.kafkaProducer.send({
            topic: constants_1.KAFKA_TOPICS.DRIVER_REPLACED,
            messages: [{ value: JSON.stringify(data) }],
        });
        logger_1.logger.info(`Event published to ${constants_1.KAFKA_TOPICS.DRIVER_REPLACED}`, { rideId: data.rideId });
    }
    catch (error) {
        logger_1.logger.error(`Failed to publish ${constants_1.KAFKA_TOPICS.DRIVER_REPLACED}`, error);
    }
};
exports.publishDriverReplacedEvent = publishDriverReplacedEvent;
const publishRideTransferredEvent = async (data) => {
    try {
        await kafka_1.kafkaProducer.send({
            topic: constants_1.KAFKA_TOPICS.RIDE_TRANSFERRED,
            messages: [{ value: JSON.stringify(data) }],
        });
        logger_1.logger.info(`Event published to ${constants_1.KAFKA_TOPICS.RIDE_TRANSFERRED}`, { rideId: data.rideId });
    }
    catch (error) {
        logger_1.logger.error(`Failed to publish ${constants_1.KAFKA_TOPICS.RIDE_TRANSFERRED}`, error);
    }
};
exports.publishRideTransferredEvent = publishRideTransferredEvent;
const publishAutoshiftCompletedEvent = async (data) => {
    try {
        await kafka_1.kafkaProducer.send({
            topic: constants_1.KAFKA_TOPICS.AUTOSHIFT_COMPLETED,
            messages: [{ value: JSON.stringify(data) }],
        });
        logger_1.logger.info(`Event published to ${constants_1.KAFKA_TOPICS.AUTOSHIFT_COMPLETED}`, { autoshiftId: data.autoshiftId });
    }
    catch (error) {
        logger_1.logger.error(`Failed to publish ${constants_1.KAFKA_TOPICS.AUTOSHIFT_COMPLETED}`, error);
    }
};
exports.publishAutoshiftCompletedEvent = publishAutoshiftCompletedEvent;
const publishAutoshiftFailedEvent = async (data) => {
    try {
        await kafka_1.kafkaProducer.send({
            topic: constants_1.KAFKA_TOPICS.AUTOSHIFT_FAILED,
            messages: [{ value: JSON.stringify(data) }],
        });
        logger_1.logger.info(`Event published to ${constants_1.KAFKA_TOPICS.AUTOSHIFT_FAILED}`, { autoshiftId: data.autoshiftId });
    }
    catch (error) {
        logger_1.logger.error(`Failed to publish ${constants_1.KAFKA_TOPICS.AUTOSHIFT_FAILED}`, error);
    }
};
exports.publishAutoshiftFailedEvent = publishAutoshiftFailedEvent;
