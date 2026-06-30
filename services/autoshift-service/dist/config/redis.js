"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const env_1 = require("./env");
const logger_1 = require("./logger");
exports.redisClient = (0, redis_1.createClient)({
    url: env_1.env.redis.url,
});
exports.redisClient.on('error', (err) => logger_1.logger.error('Redis Client Error', err));
const connectRedis = async () => {
    try {
        await exports.redisClient.connect();
        logger_1.logger.info('Connected to Redis successfully');
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to Redis', error);
        process.exit(1);
    }
};
exports.connectRedis = connectRedis;
