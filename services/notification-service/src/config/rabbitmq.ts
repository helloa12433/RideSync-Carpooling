import amqplib, { Connection, Channel } from 'amqplib';
import { env } from './env';
import { logger } from './logger';

export let rabbitMqConnection: any;
export let rabbitMqChannel: any;

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    rabbitMqConnection = await amqplib.connect(env.rabbitmq.url);
    console.log('✓ Connected to RabbitMQ');
    logger.info('Connected Successfully');

    rabbitMqChannel = await rabbitMqConnection.createChannel();
    console.log('✓ Channel Created');
    logger.info('Channel Created Successfully');
  } catch (error: any) {
    logger.error('RabbitMQ Connection Failed', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};
