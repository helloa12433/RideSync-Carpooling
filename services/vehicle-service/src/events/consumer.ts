import { consumer } from '../config/kafka';
import { logger } from '../config/logger';

export const startConsumer = async (): Promise<void> => {
  try {
    // Subscribe to topics here if needed.
    // e.g. await consumer.subscribe({ topic: 'some_topic', fromBeginning: true });
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = message.value?.toString();
        if (!payload) return;
        
        try {
          const data = JSON.parse(payload);
          logger.info(`Received event on topic ${topic}`, { data });
          
          // Handle events based on topic
        } catch (error) {
          logger.error('Error processing message', { error, topic, payload });
        }
      },
    });
    
    logger.info('Kafka consumer started successfully');
  } catch (error) {
    logger.error('Failed to start Kafka consumer', { error });
    process.exit(1);
  }
};
