import express from 'express';
import cors from 'cors';
import autoshiftRoutes from './routes/autoshift.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/autoshift', autoshiftRoutes);

app.use(errorHandler);

export default app;
