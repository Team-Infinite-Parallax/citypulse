import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import trafficRoutes from './routes/traffic.js';
import queryRoutes from './routes/query.js';
import forecastRoutes from './routes/forecast.js';
import healthRoutes from './routes/health.js';
import publicSafetyRoutes from './routes/publicSafety.js';
import environmentRoutes from './routes/environment.js';
import actionsRoutes from './routes/actions.js';
import citizenRoutes from './routes/citizen.js';
import tourismRoutes from './routes/tourism.js';
import energyRoutes from './routes/energy.js';
import planRoutes from './routes/plan.js';
import educationRoutes from './routes/education.js';
import communityRoutes from './routes/community.js';
import sseRoutes from './routes/sse.js';
import wasteRoutes from './routes/waste.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

// ... (keep middleware untouched)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : true; // Allow all if not specified, even in production, to prevent frontend breakage

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 photo payloads

// Rate limiting — relaxed for development
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

const authenticateKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (process.env.BACKEND_API_KEY && apiKey !== process.env.BACKEND_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
  next();
};
app.use('/api/', authenticateKey);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/traffic', trafficRoutes);
app.use('/api/query', queryRoutes);
app.use('/api', forecastRoutes);
app.use('/api', healthRoutes);

// Phase 2 Routes
app.use('/api/public-safety', publicSafetyRoutes);
app.use('/api/environment', environmentRoutes);
app.use('/api/waste', wasteRoutes);

// Phase 3 Routes
app.use('/api/actions', actionsRoutes);
app.use('/api/citizen', citizenRoutes);

// Phase 4 Routes — Tourism & Local Economy, Energy & Smart Utilities, Agentic Planning (ADK)
app.use('/api/tourism', tourismRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/plan', planRoutes);

// Phase 5 Routes — Education & Lifelong Learning, Community Support & Social Impact
app.use('/api/education', educationRoutes);
app.use('/api/community', communityRoutes);

// Real-time Server-Sent Events
app.use('/api/events', sseRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
