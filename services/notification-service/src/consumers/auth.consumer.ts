import { logger } from '../config/logger';
import { requestContext } from '@carpool/shared-utils';
import { publishWelcomeEmailJob } from '../producers/email.producer';

export const handleAuthEvents = async (topic: string, partition: number, message: any) => {
  const requestId = message.headers?.['x-request-id']?.toString() || 'system';
  
  return new Promise<void>((resolve) => {
    requestContext.run({ requestId }, async () => {
      const value = message.value?.toString();
      let parsedValue: any = {};
      try { if (value) parsedValue = JSON.parse(value); } catch (e) {}

      if (topic === 'auth.user.registered') {
        console.log('\n---------------------------------------------------\n');
        logger.info('Kafka Event Received');
        logger.info(`Topic : ${topic}`);
        logger.info('Creating Email Job');
        await publishWelcomeEmailJob(parsedValue);
      } else if (topic === 'auth.user.loggedin') {
        logger.info('Received auth.user.loggedin');
        logger.info('Preparing Notification');
      }
      
      resolve();
    });
  });
};
