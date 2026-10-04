import express from 'express';
import uploadRoutes from './routes/uploadRoutes.js';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5174' }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));
app.use(morgan('dev'));
app.use('/api/uploads', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'staynest-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
