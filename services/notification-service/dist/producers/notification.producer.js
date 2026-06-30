"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishEvent = exports.connectProducer = void 0;
const kafka_1 = require("../config/kafka");
const logger_1 = require("../config/logger");
const producer = kafka_1.kafka.producer();
const connectProducer = async () => {
    try {
        await producer.connect();
        logger_1.logger.info('Connected to Kafka producer successfully');
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to Kafka producer', error);
    }
};
exports.connectProducer = connectProducer;
// Even though notification service mainly consumes, it might need to produce acknowledgment events
const publishEvent = async (topic, message) => {
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        logger_1.logger.info(`Published event to ${topic}`);
    }
    catch (error) {
        logger_1.logger.error(`Failed to publish event to ${topic}`, error);
    }
};
exports.publishEvent = publishEvent;
