import { Kafka } from 'kafkajs';
import { env } from './env';
import { logger } from './logger';

export const kafkaClient = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS,
});

export const producer = kafkaClient.producer();
export const consumer = kafkaClient.consumer({ groupId: env.KAFKA_GROUP_ID });

export const connectKafka = async (): Promise<void> => {
  try {
    await producer.connect();
    await consumer.connect();
    logger.info('Connected to Kafka successfully');
  } catch (error) {
    logger.error('Failed to connect to Kafka', { error });
    process.exit(1);
  }
};
