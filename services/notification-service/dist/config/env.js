"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
exports.env = {
    port: process.env.PORT || 3006,
    nodeEnv: process.env.NODE_ENV || 'development',
    kafka: {
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
        clientId: 'notification-service'
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://localhost:5672'
    },
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || '',
        from: process.env.MAIL_FROM || 'noreply@ridesync.com'
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};
