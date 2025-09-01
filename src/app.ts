import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import clientRoutes from './routes/client.routes';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/clients', clientRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
