import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { detectRateSpikes } from '../lib/anomaly.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INCIDENTS_FILE = path.join(__dirname, '..', 'data', 'incidents.json');

export const getIncidents = async () => {
  try {
    const data = await fs.readFile(INCIDENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading incidents.json:', err);
    return [];
  }
};

// GET /api/public-safety/incidents
router.get('/incidents', async (req, res) => {
  const incidents = await getIncidents();
  res.json(incidents);
});

// GET /api/public-safety/anomalies
router.get('/anomalies', async (req, res) => {
  const incidents = await getIncidents();
  // Group by ward, bucket by 24h, detect spikes in incident rate
  const spikes = detectRateSpikes(incidents, {
    groupBy: 'ward',
    timestamp: 'timestamp',
    bucketHours: 24,
    window: 7,
    z: 2,
    minBaseline: 3
  });
  res.json(spikes);
});

export default router;
