import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api';
import { errorHandler } from './middlewares/errorHandler';
import { env } from './config/env';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// Base Route Configuration
app.use('/api/v1', apiRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;