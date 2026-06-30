import { consumer } from '../config/kafka';
import { logger } from '../config/logger';
import { startBookingConsumer, handleBookingEvents } from './booking.consumer';
import { startPaymentConsumer, handlePaymentEvents } from './payment.consumer';
import { startRideConsumer, handleRideEvents } from './ride.consumer';
import { startTrackingConsumer, handleTrackingEvents } from './tracking.consumer';
import { startAutoShiftConsumer, handleAutoShiftEvents } from './autoshift.consumer';
import { handleAuthEvents } from './auth.consumer';
import { startEmailWorker } from '../jobs/email.worker';

export const startAllConsumers = async () => {
  try {
    await startBookingConsumer();
    await startPaymentConsumer();
    await startRideConsumer();
    await startTrackingConsumer();
    await startAutoShiftConsumer();
    
    await startEmailWorker();

    await consumer.subscribe({ topic: 'auth.user.registered', fromBeginning: false });
    await consumer.subscribe({ topic: 'auth.user.loggedin', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        await handleBookingEvents(topic, partition, message);
        await handlePaymentEvents(topic, partition, message);
        await handleRideEvents(topic, partition, message);
        await handleTrackingEvents(topic, partition, message);
        await handleAutoShiftEvents(topic, partition, message);
        if (topic.startsWith('auth.')) {
          await handleAuthEvents(topic, partition, message);
        }
      },
    });

    logger.info('All Kafka consumers are running');
  } catch (error) {
    logger.error('Failed to start consumers', error);
  }
};
