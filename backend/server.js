import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import trafficRoutes from './routes/traffic.js';
import queryRoutes from './routes/query.js';
import forecastRoutes from './routes/forecast.js';
import healthRoutes from './routes/health.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:4321', 'http://localhost:3000', 'http://localhost:4322'];

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? allowedOrigins : true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// API Key middleware for basic auth
const authenticateKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  // For hackathon demo, if no API key is set in backend .env, allow all
  if (process.env.BACKEND_API_KEY && apiKey !== process.env.BACKEND_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
  next();
};
app.use('/api/', authenticateKey);

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

// Stage 9: Environmental / health advisory routes (second domain)
app.use('/api', healthRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
