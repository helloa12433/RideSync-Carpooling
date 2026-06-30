import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectCassandra } from './config/cassandra';
import { connectRedis } from './config/redis';
import { connectKafka } from './config/kafka';
import { startConsumer } from './events/consumer';
import { errorHandler } from './middleware/error.middleware';
import vehicleRoutes from './routes/vehicle.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/vehicles', vehicleRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectCassandra();
    await connectRedis();
    await connectKafka();
    await startConsumer();

    app.listen(env.PORT, () => {
      logger.info(`Vehicle Service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

startServer();
