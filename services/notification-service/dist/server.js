"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const socket_1 = require("./config/socket");
const kafka_1 = require("./config/kafka");
const rabbitmq_1 = require("./config/rabbitmq");
const consumers_1 = require("./consumers");
const notification_producer_1 = require("./producers/notification.producer");
const worker_1 = require("./jobs/worker");
const email_1 = require("./config/email");
const startServer = async () => {
    try {
        const httpServer = (0, http_1.createServer)(app_1.default);
        // Initialize Socket.io
        (0, socket_1.setupSocket)(httpServer);
        // Initialize Message Brokers
        await (0, kafka_1.connectKafka)();
        await (0, notification_producer_1.connectProducer)();
        await (0, rabbitmq_1.connectRabbitMQ)();
        await (0, email_1.connectSMTP)();
        // Start consuming events
        await (0, consumers_1.startAllConsumers)();
        await (0, worker_1.startRabbitMqWorker)();
        httpServer.listen(env_1.env.port, () => {
            logger_1.logger.info(`Notification Service is running on port ${env_1.env.port} in ${env_1.env.nodeEnv} mode`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start Notification Service', error);
        process.exit(1);
    }
};
startServer();
