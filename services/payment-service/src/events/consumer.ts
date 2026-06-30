import { kafkaConsumer } from '../config/kafka';
import { logger } from '../config/logger';
import { paymentIntentService } from '../services/payment-intent.service';
import { paymentService } from '../services/payment.service';
import { refundService } from '../services/refund.service';
import { KAFKA_TOPICS } from '../utils/constants';

export const startKafkaConsumer = async () => {
  try {
    await kafkaConsumer.subscribe({ topic: KAFKA_TOPICS.BOOKING_CREATED, fromBeginning: true });
    await kafkaConsumer.subscribe({ topic: KAFKA_TOPICS.BOOKING_CANCELLED, fromBeginning: true });
    await kafkaConsumer.subscribe({ topic: KAFKA_TOPICS.REFUND_REQUESTED, fromBeginning: true });
    
    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (!value) return;

        const eventData = JSON.parse(value);
        logger.info(`Received ${topic} event`);
        
        switch(topic) {
          case KAFKA_TOPICS.BOOKING_CREATED:
            await paymentIntentService.createIntent({
              bookingId: eventData.id,
              userId: eventData.user_id,
              amount: eventData.total_price,
              currency: 'USD',
            });
            break;
            
          case KAFKA_TOPICS.BOOKING_CANCELLED:
            // Could cancel the pending payment intent here if the booking is cancelled
            // But we need the paymentId. For now, just logging.
            logger.info(`Booking ${eventData.id} cancelled. Need to fetch payment to cancel it.`);
            break;

          case KAFKA_TOPICS.REFUND_REQUESTED:
            if (eventData.paymentId) {
              await refundService.processRefund(eventData.paymentId, eventData.reason);
            }
            break;
        }
      },
    });
  } catch (error) {
    logger.error('Error starting Kafka consumer', error);
  }
};
