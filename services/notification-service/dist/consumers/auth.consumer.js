"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAuthEvents = void 0;
const logger_1 = require("../config/logger");
const shared_utils_1 = require("@carpool/shared-utils");
const email_producer_1 = require("../producers/email.producer");
const handleAuthEvents = async (topic, partition, message) => {
    const requestId = message.headers?.['x-request-id']?.toString() || 'system';
    return new Promise((resolve) => {
        shared_utils_1.requestContext.run({ requestId }, async () => {
            const value = message.value?.toString();
            let parsedValue = {};
            try {
                if (value)
                    parsedValue = JSON.parse(value);
            }
            catch (e) { }
            if (topic === 'auth.user.registered') {
                console.log('Kafka Consume');
                logger_1.logger.info('Preparing Notification');
                await (0, email_producer_1.publishWelcomeEmailJob)(parsedValue);
            }
            else if (topic === 'auth.user.loggedin') {
                logger_1.logger.info('Received auth.user.loggedin');
                logger_1.logger.info('Preparing Notification');
            }
            resolve();
        });
    });
};
exports.handleAuthEvents = handleAuthEvents;
