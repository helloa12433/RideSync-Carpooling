"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishEvent = exports.connectKafka = exports.consumer = void 0;
const kafkajs_1 = require("kafkajs");
const logger_1 = require("../utils/logger");
const shared_utils_1 = require("@carpool/shared-utils");
const kafka = new kafkajs_1.Kafka({
    clientId: 'auth-service',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});
const producer = kafka.producer();
const admin = kafka.admin();
exports.consumer = kafka.consumer({ groupId: 'auth-service-group' });
const connectKafka = async () => {
    try {
        await admin.connect();
        await admin.createTopics({
            topics: [
                { topic: 'auth.user.loggedin' },
                { topic: 'auth.user.logout' },
                { topic: 'auth.user.registered' },
                { topic: 'auth.token.refresh' },
                { topic: 'auth.token.revoked' }
            ],
            waitForLeaders: true,
        });
        await admin.disconnect();
        await producer.connect();
        console.log('Connected to Kafka successfully');
    }
    catch (error) {
        console.error('Kafka connection failed', error);
    }
};
exports.connectKafka = connectKafka;
const publishEvent = async (topic, message) => {
    try {
        const store = shared_utils_1.requestContext.getStore();
        const requestId = store?.requestId || 'system';
        console.log(`\nPublishing Kafka Event → ${topic}\nPayload:\n${JSON.stringify(message, null, 2)}\n`);
        const responses = await producer.send({
            topic,
            messages: [{
                    value: JSON.stringify(message),
                    headers: { 'x-request-id': requestId }
                }],
        });
        if (responses && responses.length > 0) {
            const { partition, baseOffset } = responses[0];
            const trace = `\nProducer Success\nTopic: ${topic}\nPartition: ${partition}\nOffset: ${baseOffset}\n`;
            console.log(trace);
        }
    }
    catch (error) {
        logger_1.logger.error(`Failed to publish event to ${topic}`, { error: error.message });
    }
};
exports.publishEvent = publishEvent;
exports.default = kafka;
