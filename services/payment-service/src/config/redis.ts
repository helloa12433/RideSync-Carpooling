import { createClient } from 'redis';
import { env } from './env';
import { logger } from './logger';

export const redisClient = createClient({
  url: env.redis.url,
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('Connected to Redis successfully');
  } catch (error) {
    logger.error('Failed to connect to Redis', error);
    process.exit(1);
  }
};
