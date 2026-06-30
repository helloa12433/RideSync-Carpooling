"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
dotenv_1.default.config();
const envSchema = joi_1.default.object({
    PORT: joi_1.default.number().default(3002),
    NODE_ENV: joi_1.default.string().valid('development', 'production', 'test').default('development'),
    KAFKA_BROKERS: joi_1.default.string().required(),
    KAFKA_CLIENT_ID: joi_1.default.string().default('autoshift-service'),
    RABBITMQ_URL: joi_1.default.string().required(),
    REDIS_URL: joi_1.default.string().required(),
    CASSANDRA_CONTACT_POINTS: joi_1.default.string().required(),
    CASSANDRA_LOCAL_DATA_CENTER: joi_1.default.string().default('datacenter1'),
    CASSANDRA_KEYSPACE: joi_1.default.string().default('autoshift'),
    RIDE_SERVICE_URL: joi_1.default.string().required(),
    BOOKING_SERVICE_URL: joi_1.default.string().required(),
    MATCHING_SERVICE_URL: joi_1.default.string().required(),
    TRACKING_SERVICE_URL: joi_1.default.string().required(),
    DRIVER_SERVICE_URL: joi_1.default.string().required(),
    NOTIFICATION_SERVICE_URL: joi_1.default.string().required(),
    JWT_SECRET: joi_1.default.string().required(),
}).unknown(true);
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
exports.env = {
    port: envVars.PORT,
    nodeEnv: envVars.NODE_ENV,
    kafka: {
        brokers: envVars.KAFKA_BROKERS.split(','),
        clientId: envVars.KAFKA_CLIENT_ID,
    },
    rabbitmq: {
        url: envVars.RABBITMQ_URL,
    },
    redis: {
        url: envVars.REDIS_URL,
    },
    cassandra: {
        contactPoints: envVars.CASSANDRA_CONTACT_POINTS.split(','),
        localDataCenter: envVars.CASSANDRA_LOCAL_DATA_CENTER,
        keyspace: envVars.CASSANDRA_KEYSPACE,
    },
    services: {
        ride: envVars.RIDE_SERVICE_URL,
        booking: envVars.BOOKING_SERVICE_URL,
        matching: envVars.MATCHING_SERVICE_URL,
        tracking: envVars.TRACKING_SERVICE_URL,
        driver: envVars.DRIVER_SERVICE_URL,
        notification: envVars.NOTIFICATION_SERVICE_URL,
    },
    jwt: {
        secret: envVars.JWT_SECRET,
    },
};
