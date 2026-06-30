"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRabbitMQ = exports.rabbitMqChannel = exports.rabbitMqConnection = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const env_1 = require("./env");
const logger_1 = require("./logger");
const connectRabbitMQ = async () => {
    try {
        exports.rabbitMqConnection = await amqplib_1.default.connect(env_1.env.rabbitmq.url);
        exports.rabbitMqChannel = await exports.rabbitMqConnection.createChannel();
        logger_1.logger.info('Connected to RabbitMQ successfully');
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to RabbitMQ', error);
        process.exit(1);
    }
};
exports.connectRabbitMQ = connectRabbitMQ;
