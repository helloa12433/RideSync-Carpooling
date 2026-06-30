"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const cassandra_1 = require("./config/cassandra");
const redis_1 = require("./config/redis");
const kafka_1 = require("./config/kafka");
const rabbitmq_1 = require("./config/rabbitmq");
const consumer_1 = require("./events/consumer");
const worker_1 = require("./jobs/worker");
const retry_worker_1 = require("./jobs/retry.worker");
const startServer = async () => {
    try {
        // Initialize Database Connections
        await (0, cassandra_1.connectCassandra)();
        await (0, redis_1.connectRedis)();
        // Initialize Message Brokers
        await (0, kafka_1.connectKafka)();
        await (0, rabbitmq_1.connectRabbitMQ)();
        // Start Consumers and Workers
        await (0, consumer_1.startKafkaConsumer)();
        await (0, worker_1.startRabbitMqWorker)();
        await (0, retry_worker_1.startRetryWorker)();
        app_1.default.listen(env_1.env.port, () => {
            logger_1.logger.info(`AutoShift Service running on port ${env_1.env.port}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server', error);
        process.exit(1);
    }
};
startServer();
