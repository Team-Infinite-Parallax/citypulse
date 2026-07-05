import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'traffic.json');

const getTrafficData = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
};

// GET /api/alerts
// Returns anomalies (congestion > 90 or has incident notes)
router.get('/alerts', (req, res) => {
  const data = getTrafficData();
  
  const alerts = data.filter(record => {
    const isHighCongestion = record.congestion > 90;
    const hasIncident = record.notes && record.notes.toLowerCase().includes('incident');
    return isHighCongestion || hasIncident;
  }).map(record => ({
    id: `${record.route_name}-${record.timestamp}`,
    route_name: record.route_name,
    timestamp: record.timestamp,
    severity: record.congestion > 95 ? 'CRITICAL' : 'WARNING',
    message: record.notes || `Severe congestion detected (${record.congestion}/100)`,
    metrics: {
      congestion: record.congestion,
      delay: record.delay_minutes
    }
  }));

  // Sort by latest first
  alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json(alerts);
});

export default router;
