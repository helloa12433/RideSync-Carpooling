import { kafkaConsumer } from '../config/kafka';
import { logger } from '../config/logger';
import { KAFKA_TOPICS } from '../utils/constants';

export const startConsumer = async (): Promise<void> => {
  try {
    // You can subscribe to topics here
    // await kafkaConsumer.subscribe({ topic: KAFKA_TOPICS.RIDE_CREATED, fromBeginning: true });
    
    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = message.value?.toString();
        if (!payload) return;
        
        try {
          const data = JSON.parse(payload);
          logger.info(`Received event on topic ${topic}`, { data });
          
          // Add event handling logic here based on the topic
        } catch (error) {
          logger.error('Error processing Kafka message', { error, topic, payload });
        }
      },
    });
    
    logger.info('Kafka consumer started successfully');
  } catch (error) {
    logger.error('Failed to start Kafka consumer', { error });
    process.exit(1);
  }
};
