"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRabbitMqWorker = void 0;
const rabbitmq_1 = require("../config/rabbitmq");
const constants_1 = require("../utils/constants");
const autoshift_service_1 = require("../services/autoshift.service");
const logger_1 = require("../config/logger");
const startRabbitMqWorker = async () => {
    try {
        await rabbitmq_1.rabbitMqChannel.assertQueue(constants_1.RABBITMQ_QUEUES.AUTOSHIFT_RETRY, { durable: true });
        rabbitmq_1.rabbitMqChannel.consume(constants_1.RABBITMQ_QUEUES.AUTOSHIFT_RETRY, async (msg) => {
            if (!msg)
                return;
            const { rideId, driverId, reason } = JSON.parse(msg.content.toString());
            try {
                logger_1.logger.info(`Processing autoshift retry for ride ${rideId}`);
                await autoshift_service_1.autoshiftService.handleEvent(rideId, driverId, reason);
                rabbitmq_1.rabbitMqChannel.ack(msg);
            }
            catch (error) {
                logger_1.logger.error(`Error processing autoshift retry for ride ${rideId}`, error);
                rabbitmq_1.rabbitMqChannel.nack(msg, false, false);
            }
        });
        logger_1.logger.info('RabbitMQ worker started successfully');
    }
    catch (error) {
        logger_1.logger.error('Error starting RabbitMQ worker', error);
    }
};
exports.startRabbitMqWorker = startRabbitMqWorker;
