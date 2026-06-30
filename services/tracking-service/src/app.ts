import express from 'express';
import cors from 'cors';
import trackingRoutes from './routes/tracking.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/tracking', trackingRoutes);

app.use(errorHandler);

export default app;
