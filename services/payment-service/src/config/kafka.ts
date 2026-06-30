import { Kafka, Producer, Consumer } from 'kafkajs';
import { env } from './env';
import { logger } from './logger';

export const kafka = new Kafka({
  clientId: env.kafka.clientId,
  brokers: env.kafka.brokers,
});

export const kafkaProducer: Producer = kafka.producer();
export const kafkaConsumer: Consumer = kafka.consumer({ groupId: 'payment-service-group' });

export const connectKafka = async (): Promise<void> => {
  try {
    await kafkaProducer.connect();
    logger.info('Kafka Producer connected successfully');
    
    await kafkaConsumer.connect();
    logger.info('Kafka Consumer connected successfully');
  } catch (error) {
    logger.error('Failed to connect to Kafka', error);
    process.exit(1);
  }
};
