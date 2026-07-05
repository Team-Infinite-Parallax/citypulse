import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import trafficRoutes from './routes/traffic.js';
import queryRoutes from './routes/query.js';
import forecastRoutes from './routes/forecast.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Stage 1: Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Stage 3: Traffic routes
app.use('/api/traffic', trafficRoutes);

// Stage 6: Query routes
app.use('/api/query', queryRoutes);

// Stage 8: Forecast / Alerts routes
app.use('/api', forecastRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
