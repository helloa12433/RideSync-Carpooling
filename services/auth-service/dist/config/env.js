"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../.env') });
exports.env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'access_secret',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    KAFKA_BROKERS: process.env.KAFKA_BROKERS
        ? process.env.KAFKA_BROKERS.split(',')
        : ['localhost:9092'],
    CASSANDRA_CONTACT_POINTS: process.env.CASSANDRA_CONTACT_POINTS
        ? process.env.CASSANDRA_CONTACT_POINTS.split(',')
        : ['127.0.0.1'],
    CASSANDRA_LOCAL_DATACENTER: process.env.CASSANDRA_LOCAL_DATACENTER || 'datacenter1',
    CASSANDRA_KEYSPACE: process.env.CASSANDRA_KEYSPACE || 'carpool',
};
