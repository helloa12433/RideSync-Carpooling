import { Kafka, Consumer } from 'kafkajs';
import { env } from './env';
import { logger } from './logger';

export const kafka = new Kafka({
  clientId: env.kafka.clientId,
  brokers: env.kafka.brokers
});

export const consumer: Consumer = kafka.consumer({ groupId: 'notification-service-group' });
const admin = kafka.admin();

export const connectKafka = async () => {
  try {
    await admin.connect();
    await admin.createTopics({
      topics: [
        { topic: 'auth.user.loggedin' },
        { topic: 'auth.user.logout' },
        { topic: 'auth.user.registered' }
      ],
      waitForLeaders: true,
    });
    await admin.disconnect();

    await consumer.connect();
    logger.info('Connected to Kafka consumer successfully');
  } catch (error) {
    logger.error('Kafka connection failed', error);
    process.exit(1);
  }
};
