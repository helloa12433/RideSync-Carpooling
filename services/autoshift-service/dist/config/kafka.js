"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectKafka = exports.kafkaConsumer = exports.kafkaProducer = exports.kafka = void 0;
const kafkajs_1 = require("kafkajs");
const env_1 = require("./env");
const logger_1 = require("./logger");
exports.kafka = new kafkajs_1.Kafka({
    clientId: env_1.env.kafka.clientId,
    brokers: env_1.env.kafka.brokers,
});
exports.kafkaProducer = exports.kafka.producer();
exports.kafkaConsumer = exports.kafka.consumer({ groupId: 'autoshift-service-group' });
const connectKafka = async () => {
    try {
        await exports.kafkaProducer.connect();
        logger_1.logger.info('Kafka Producer connected successfully');
        await exports.kafkaConsumer.connect();
        logger_1.logger.info('Kafka Consumer connected successfully');
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to Kafka', error);
        process.exit(1);
    }
};
exports.connectKafka = connectKafka;
