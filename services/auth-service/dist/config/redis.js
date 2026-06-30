"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const redisClient = new ioredis_1.Redis(process.env.REDIS_URL || 'redis://localhost:6379');
redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
});
redisClient.on('error', (err) => {
    console.error('Redis connection failed', err);
});
exports.default = redisClient;
