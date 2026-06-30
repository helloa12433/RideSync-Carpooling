import { kafkaConsumer } from '../config/kafka';
import { logger } from '../config/logger';
import { trackingService } from '../services/tracking.service';
import { KAFKA_TOPICS } from '../utils/constants';

export const startKafkaConsumer = async () => {
  try {
    await kafkaConsumer.subscribe({ topic: KAFKA_TOPICS.RIDE_STARTED, fromBeginning: true });
    await kafkaConsumer.subscribe({ topic: KAFKA_TOPICS.RIDE_COMPLETED, fromBeginning: true });
    await kafkaConsumer.subscribe({ topic: KAFKA_TOPICS.RIDE_CANCELLED, fromBeginning: true });
    
    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (!value) return;

        const eventData = JSON.parse(value);
        logger.info(`Received ${topic} event for ride ${eventData.id}`);
        
        switch(topic) {
          case KAFKA_TOPICS.RIDE_STARTED:
            await trackingService.handleRideStarted(eventData.id);
            break;
          case KAFKA_TOPICS.RIDE_COMPLETED:
            await trackingService.handleRideCompleted(eventData.id);
            break;
          case KAFKA_TOPICS.RIDE_CANCELLED:
            await trackingService.handleRideCancelled(eventData.id);
            break;
        }
      },
    });
  } catch (error) {
    logger.error('Error starting Kafka consumer', error);
  }
};
