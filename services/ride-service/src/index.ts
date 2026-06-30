import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectCassandra } from './config/cassandra';
import { connectRedis } from './config/redis';
import { connectKafka } from './config/kafka';
import { rabbitmq } from './config/rabbitmq';
import { startConsumer } from './events/consumer';
import { errorHandler } from './middleware/error.middleware';
import rideRoutes from './routes/ride.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/rides', rideRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectCassandra();
    await connectRedis();
    await connectKafka();
    await rabbitmq.connect();
    
    await startConsumer();

    app.listen(env.PORT, () => {
      logger.info(`Ride Service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

  } catch (error) {
    logger.error('Failed to start Ride Service', { error });
    process.exit(1);
  }
};

startServer();

process.on('SIGINT', async () => {
  logger.info('Shutting down Ride Service gracefully...');
  await rabbitmq.close();
  process.exit(0);
});
