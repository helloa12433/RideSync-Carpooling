import { Kafka } from 'kafkajs';
import { logger } from '../utils/logger';
import { requestContext } from '@carpool/shared-utils';

const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const producer = kafka.producer();
const admin = kafka.admin();

export const consumer = kafka.consumer({ groupId: 'auth-service-group' });

export const connectKafka = async () => {
  try {
    await admin.connect();
    await admin.createTopics({
      topics: [
        { topic: 'auth.user.loggedin' },
        { topic: 'auth.user.logout' },
        { topic: 'auth.user.registered' },
        { topic: 'auth.token.refresh' },
        { topic: 'auth.token.revoked' }
      ],
      waitForLeaders: true,
    });
    await admin.disconnect();

    await producer.connect();
    console.log('Connected to Kafka successfully');
  } catch (error) {
    console.error('Kafka connection failed', error);
  }
};

export const publishEvent = async (topic: string, message: any) => {
  try {
    const store = requestContext.getStore();
    const requestId = store?.requestId || 'system';

    console.log(`\nPublishing Kafka Event → ${topic}\nPayload:\n${JSON.stringify(message, null, 2)}\n`);

    const responses = await producer.send({
      topic,
      messages: [{ 
        value: JSON.stringify(message),
        headers: { 'x-request-id': requestId }
      }],
    });
    
    if (responses && responses.length > 0) {
      const { partition, baseOffset } = responses[0];
      const trace = `\nProducer Success\nTopic: ${topic}\nPartition: ${partition}\nOffset: ${baseOffset}\n`;
      console.log(trace);
    }
  } catch (error) {
    logger.error(`Failed to publish event to ${topic}`, { error: (error as Error).message });
  }
};

export default kafka;
