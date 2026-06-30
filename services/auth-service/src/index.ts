import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/auth.middleware';
import { tracingMiddleware } from '@carpool/shared-utils';
import { connectCassandra } from './config/cassandra';
import { connectKafka } from './config/kafka';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(tracingMiddleware);

app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Auth Service' });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectCassandra();
    await connectKafka();
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Auth Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start auth service', error);
  }
};

startServer();
