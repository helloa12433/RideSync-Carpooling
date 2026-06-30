import { consumer } from '../config/kafka';
import { logger } from '../utils/logger';
import { userRepository } from '../repositories/user.repository';

export const startConsumer = async (): Promise<void> => {
  try {
    await consumer.connect();

    // Subscribe to auth events — creates isolated user_profiles records
    await consumer.subscribe({ topics: ['auth.user.registered', 'auth.user.loggedin'], fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const value = message.value?.toString();
        let payload: any = {};
        try { if (value) payload = JSON.parse(value); } catch (e) {}

        const userId = payload.userId || payload.id || '';
        const email  = payload.email  || '';

        if (topic === 'auth.user.registered') {
          logger.info('[UserConsumer] Received auth.user.registered', { userId, email });

          if (!userId) {
            logger.warn('[UserConsumer] Missing userId in event payload, skipping');
            return;
          }

          // Idempotently create the user_profiles record using the auth service's user ID
          const existing = await userRepository.findById(userId);
          if (!existing) {
            logger.info('[UserConsumer] Creating user_profiles record', { userId, email });
            await userRepository.createWithId(userId, {
              email,
              password_hash: '',        // Google-auth users have no password
              first_name:    payload.first_name     || '',
              last_name:     payload.last_name      || '',
              phone_number:  undefined,
              role:          'USER',
            });
            logger.info('[UserConsumer] user_profiles record created successfully', { userId });
          } else {
            logger.info('[UserConsumer] user_profiles already exists, skipping', { userId });
          }
        } else if (topic === 'auth.user.loggedin') {
          logger.info('[UserConsumer] Received auth.user.loggedin', { userId, email });
        }
      },
    });

    logger.info('[UserConsumer] Kafka consumer started, listening on: auth.user.registered, auth.user.loggedin');
  } catch (error) {
    logger.error('[UserConsumer] Failed to start Kafka consumer', { error: (error as Error).message });
  }
};
