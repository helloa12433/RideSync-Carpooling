"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleAutoshiftRetry = void 0;
const rabbitmq_1 = require("../config/rabbitmq");
const constants_1 = require("../utils/constants");
const logger_1 = require("../config/logger");
const scheduleAutoshiftRetry = async (rideId, driverId, reason) => {
    try {
        await rabbitmq_1.rabbitMqChannel.assertQueue(constants_1.RABBITMQ_QUEUES.AUTOSHIFT_RETRY, { durable: true });
        rabbitmq_1.rabbitMqChannel.sendToQueue(constants_1.RABBITMQ_QUEUES.AUTOSHIFT_RETRY, Buffer.from(JSON.stringify({ rideId, driverId, reason })), { persistent: true });
        logger_1.logger.info(`Scheduled autoshift retry for ride ${rideId}`);
    }
    catch (error) {
        logger_1.logger.error('Failed to schedule autoshift retry', error);
    }
};
exports.scheduleAutoshiftRetry = scheduleAutoshiftRetry;
