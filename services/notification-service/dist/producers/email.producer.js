"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishWelcomeEmailJob = void 0;
const rabbitmq_1 = require("../config/rabbitmq");
const logger_1 = require("../config/logger");
const shared_utils_1 = require("@carpool/shared-utils");
const publishWelcomeEmailJob = async (userPayload) => {
    const store = shared_utils_1.requestContext.getStore();
    const requestId = store?.requestId || 'system';
    const queue = 'send-welcome-email';
    await rabbitmq_1.rabbitMqChannel.assertQueue(queue, { durable: true });
    const message = {
        ...userPayload,
        requestId
    };
    const success = rabbitmq_1.rabbitMqChannel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    if (success) {
        console.log('RabbitMQ Publish');
    }
    else {
        logger_1.logger.error('Failed to publish RabbitMQ Job');
    }
};
exports.publishWelcomeEmailJob = publishWelcomeEmailJob;
