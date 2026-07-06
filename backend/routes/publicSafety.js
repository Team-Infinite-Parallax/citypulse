import express from 'express';
import { detectRateSpikes } from '../lib/anomaly.js';
import { getIncidents as getFirestoreIncidents } from '../lib/firestore.js';

const router = express.Router();

export const getIncidents = async () => {
  return await getFirestoreIncidents();
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
