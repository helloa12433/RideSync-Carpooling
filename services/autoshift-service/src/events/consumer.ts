import { kafkaConsumer } from '../config/kafka';
import { logger } from '../config/logger';
import { autoshiftService } from '../services/autoshift.service';
import { KAFKA_TOPICS, AUTOSHIFT_REASON } from '../utils/constants';

/**
 * Maps each consumed Kafka topic to an AUTOSHIFT_REASON.
 * These events are published by Driver Service when the driver
 * reports an issue via the Emergency menu in the Driver App.
 */
const TOPIC_TO_REASON: Record<string, string> = {
  [KAFKA_TOPICS.DRIVER_OFFLINE]: AUTOSHIFT_REASON.DRIVER_OFFLINE,
  [KAFKA_TOPICS.DRIVER_CANCELLED]: AUTOSHIFT_REASON.DRIVER_CANCELLED,
  [KAFKA_TOPICS.VEHICLE_BREAKDOWN]: AUTOSHIFT_REASON.VEHICLE_BREAKDOWN,
  [KAFKA_TOPICS.VEHICLE_ENGINE_FAILURE]: AUTOSHIFT_REASON.ENGINE_FAILURE,
  [KAFKA_TOPICS.VEHICLE_PUNCTURE]: AUTOSHIFT_REASON.TYRE_PUNCTURE,
  [KAFKA_TOPICS.DRIVER_ACCIDENT]: AUTOSHIFT_REASON.DRIVER_ACCIDENT,
  [KAFKA_TOPICS.DRIVER_EMERGENCY]: AUTOSHIFT_REASON.DRIVER_EMERGENCY,
  [KAFKA_TOPICS.RIDE_EMERGENCY]: AUTOSHIFT_REASON.RIDE_EMERGENCY,
};

export const startKafkaConsumer = async () => {
  try {
    // Subscribe to all driver/vehicle failure topics
    const topics = Object.keys(TOPIC_TO_REASON);
    for (const topic of topics) {
      await kafkaConsumer.subscribe({ topic, fromBeginning: false });
    }

    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (!value) return;

        const eventData = JSON.parse(value);
        const reason = TOPIC_TO_REASON[topic];

        logger.info(`Received ${topic} event for ride ${eventData.rideId}, driver ${eventData.driverId}`);

        if (!eventData.rideId || !eventData.driverId) {
          logger.warn(`Event from ${topic} missing rideId or driverId. Skipping.`);
          return;
        }

        // Delegate to AutoshiftService
        await autoshiftService.handleEvent(eventData.rideId, eventData.driverId, reason);
      },
    });

    logger.info('AutoShift Kafka consumer started successfully');
  } catch (error) {
    logger.error('Error starting Kafka consumer', error);
  }
};
