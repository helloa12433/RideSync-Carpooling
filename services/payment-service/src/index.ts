import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectCassandra } from './config/cassandra';
import { connectRedis } from './config/redis';
import { connectKafka } from './config/kafka';
import { connectRabbitMQ } from './config/rabbitmq';
import { startKafkaConsumer } from './events/consumer';
import { startRabbitMqWorker } from './jobs/worker';
import { startRetryWorker } from './jobs/retry.worker';

const startServer = async () => {
  try {
    // Initialize Database Connections
    await connectCassandra();
    await connectRedis();
    
    // Initialize Message Brokers
    await connectKafka();
    await connectRabbitMQ();

    // Start Consumers and Workers
    await startKafkaConsumer();
    await startRabbitMqWorker();
    await startRetryWorker();

    app.listen(env.port, () => {
      logger.info(`Payment Service running on port ${env.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
