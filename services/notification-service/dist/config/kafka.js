"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectKafka = exports.consumer = exports.kafka = void 0;
const kafkajs_1 = require("kafkajs");
const env_1 = require("./env");
const logger_1 = require("./logger");
exports.kafka = new kafkajs_1.Kafka({
    clientId: env_1.env.kafka.clientId,
    brokers: env_1.env.kafka.brokers
});
exports.consumer = exports.kafka.consumer({ groupId: 'notification-service-group' });
const admin = exports.kafka.admin();
const connectKafka = async () => {
    try {
        await admin.connect();
        await admin.createTopics({
            topics: [
                { topic: 'auth.user.loggedin' },
                { topic: 'auth.user.logout' },
                { topic: 'auth.user.registered' }
            ],
            waitForLeaders: true,
        });
        await admin.disconnect();
        await exports.consumer.connect();
        logger_1.logger.info('Connected to Kafka consumer successfully');
    }
    catch (error) {
        logger_1.logger.error('Kafka connection failed', error);
        process.exit(1);
    }
};
exports.connectKafka = connectKafka;
