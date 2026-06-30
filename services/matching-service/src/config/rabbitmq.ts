import amqplib, { Connection, Channel } from 'amqplib';
import { env } from './env';
import { logger } from './logger';

export let rabbitMqConnection: Connection;
export let rabbitMqChannel: Channel;

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    rabbitMqConnection = await amqplib.connect(env.rabbitmq.url);
    rabbitMqChannel = await rabbitMqConnection.createChannel();
    logger.info('Connected to RabbitMQ successfully');
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ', error);
    process.exit(1);
  }
};
