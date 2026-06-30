import { Kafka } from 'kafkajs';
import { env } from './env';
import { logger } from './logger';

export const kafkaClient = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS,
});

export const kafkaProducer = kafkaClient.producer();
export const kafkaConsumer = kafkaClient.consumer({ groupId: env.KAFKA_GROUP_ID });

export const connectKafka = async (): Promise<void> => {
  try {
    await kafkaProducer.connect();
    await kafkaConsumer.connect();
    logger.info('Connected to Kafka successfully');
  } catch (error) {
    logger.error('Failed to connect to Kafka', { error });
    process.exit(1);
  }
};
