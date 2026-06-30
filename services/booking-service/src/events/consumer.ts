import { kafkaConsumer } from '../config/kafka';
import { logger } from '../config/logger';
import { bookingSaga } from '../saga/booking.saga';

export const startKafkaConsumer = async () => {
  try {
    await kafkaConsumer.subscribe({ topic: 'payment-success', fromBeginning: true });
    await kafkaConsumer.subscribe({ topic: 'payment-failed', fromBeginning: true });
    await kafkaConsumer.subscribe({ topic: 'ride-cancelled', fromBeginning: true });
    
    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        logger.info(`Received message from ${topic}`, { partition, value });
        
        if (!value) return;
        
        const event = JSON.parse(value);
        
        switch (topic) {
          case 'payment-success':
            await bookingSaga.handlePaymentSuccess(event);
            break;
          case 'payment-failed':
            await bookingSaga.handlePaymentFailed(event);
            break;
          case 'ride-cancelled':
            await bookingSaga.handleRideCancelled(event);
            break;
          default:
            logger.warn(`Unhandled topic: ${topic}`);
        }
      },
    });
  } catch (error) {
    logger.error('Error starting Kafka consumer', error);
  }
};
