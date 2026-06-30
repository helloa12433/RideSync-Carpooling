import { consumer } from '../config/kafka';
import { logger } from '../config/logger';
import { driverRepository } from '../repositories/driver.repository';
import { publishEvent } from './producer';

export const startConsumer = async (): Promise<void> => {
  try {
    await consumer.connect();

    // Subscribe to auth events — creates isolated driver_profiles records
    await consumer.subscribe({ topics: ['auth.user.registered', 'auth.user.loggedin'], fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const value = message.value?.toString();
        let payload: any = {};
        try { if (value) payload = JSON.parse(value); } catch (e) {}

        const userId = payload.userId || payload.id || '';
        const email  = payload.email  || '';

        if (topic === 'auth.user.registered') {
          logger.info('[DriverConsumer] Received auth.user.registered', { userId, email });

          if (!userId) {
            logger.warn('[DriverConsumer] Missing userId in event payload, skipping');
            return;
          }

          // Idempotently create the driver_profiles record using the auth user ID as user_id
          const existing = await driverRepository.findByUserId(userId);
          if (!existing) {
            logger.info('[DriverConsumer] Creating driver_profiles record', { userId, email });
            await driverRepository.create({
              user_id:         userId,
              email:           email,
              first_name:      payload.first_name     || '',
              last_name:       payload.last_name      || '',
              profile_picture: payload.profile_picture || '',
              license_number:  '',
            });
            logger.info('[DriverConsumer] driver_profiles record created successfully', { userId });

            // Publish driver.created Kafka event
            await publishEvent('driver.created', { userId, email, timestamp: new Date().toISOString() });
          } else {
            logger.info('[DriverConsumer] driver_profiles already exists, skipping', { userId });
          }
        } else if (topic === 'auth.user.loggedin') {
          logger.info('[DriverConsumer] Received auth.user.loggedin', { userId, email });
        }
      },
    });

    logger.info('[DriverConsumer] Kafka consumer started, listening on: auth.user.registered, auth.user.loggedin');
  } catch (error) {
    logger.error('[DriverConsumer] Failed to start Kafka consumer', { error: (error as Error).message });
  }
};
