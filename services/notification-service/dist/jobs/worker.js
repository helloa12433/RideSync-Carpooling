"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRabbitMqWorker = void 0;
const rabbitmq_1 = require("../config/rabbitmq");
const logger_1 = require("../config/logger");
const socket_gateway_1 = require("../websocket/socket.gateway");
const NOTIFICATION_QUEUE = 'notification.queue';
const startRabbitMqWorker = async () => {
    if (!rabbitmq_1.rabbitMqChannel) {
        logger_1.logger.error('RabbitMQ channel not initialized for worker');
        return;
    }
    try {
        await rabbitmq_1.rabbitMqChannel.assertQueue(NOTIFICATION_QUEUE, { durable: true });
        rabbitmq_1.rabbitMqChannel.consume(NOTIFICATION_QUEUE, async (msg) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    console.log(`[RABBITMQ CONSUMER] Notification Service consumed job from queue ${NOTIFICATION_QUEUE}:`, content);
                    logger_1.logger.info(`Received Notification Job`, { targetUserId: content.userId || content.driverId });
                    const targetUserId = content.userId || content.driverId;
                    if (targetUserId) {
                        (0, socket_gateway_1.emitToUser)(targetUserId, 'notification:general', content);
                    }
                    rabbitmq_1.rabbitMqChannel.ack(msg);
                }
                catch (error) {
                    logger_1.logger.error('Error processing notification job via RabbitMQ', error);
                    // For now just ack it so it doesn't get stuck if malformed
                    rabbitmq_1.rabbitMqChannel.ack(msg);
                }
            }
        });
        logger_1.logger.info(`Started RabbitMQ worker on queue ${NOTIFICATION_QUEUE}`);
    }
    catch (error) {
        logger_1.logger.error(`Failed to start RabbitMQ worker on queue ${NOTIFICATION_QUEUE}`, error);
    }
};
exports.startRabbitMqWorker = startRabbitMqWorker;
