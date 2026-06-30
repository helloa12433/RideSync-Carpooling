import express from 'express';
import cors from 'cors';
import paymentRoutes from './routes/payment.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/payments', paymentRoutes);

app.use(errorHandler);

export default app;
