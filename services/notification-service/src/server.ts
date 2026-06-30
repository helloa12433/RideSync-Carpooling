import { createServer } from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { setupSocket } from './config/socket';
import { connectKafka } from './config/kafka';
import { connectRabbitMQ } from './config/rabbitmq';
import { startAllConsumers } from './consumers';
import { connectProducer } from './producers/notification.producer';
import { startRabbitMqWorker } from './jobs/worker';
import { connectSMTP } from './config/email';

const startServer = async () => {
  try {
    const httpServer = createServer(app);

    // Initialize Socket.io
    setupSocket(httpServer);

    // Initialize Message Brokers
    await connectKafka();
    await connectProducer();
    await connectRabbitMQ();
    await connectSMTP();

    // Start consuming events
    await startAllConsumers();
    await startRabbitMqWorker();

    httpServer.listen(env.port, () => {
      console.log('\n==========================');
      console.log('Notification Service Started');
      console.log('==========================\n');
      logger.info(`Notification Service is running on port ${env.port} in ${env.nodeEnv} mode`);
    });

  } catch (error) {
    logger.error('Failed to start Notification Service', error);
    process.exit(1);
  }
};

startServer();
