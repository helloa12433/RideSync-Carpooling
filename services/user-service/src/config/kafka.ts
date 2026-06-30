import { Kafka } from 'kafkajs';
import { env } from './env';
import { logger } from './logger';

export const kafka = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS,
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: `${env.KAFKA_CLIENT_ID}-group` });

export const connectKafka = async (): Promise<void> => {
  try {
    await producer.connect();
    logger.info('Kafka producer connected successfully');
  } catch (error) {
    logger.error('Failed to connect to Kafka', { error });
    process.exit(1);
  }
};
