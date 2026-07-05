import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateRecommendation } from '../lib/gemini.js';

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

// GET /api/recommendations
router.get('/recommendations', async (req, res) => {
  const data = getTrafficData();
  
  const peakStatsByRoute = {};
  
  data.forEach(record => {
    const hr = new Date(record.timestamp).getHours();
    const isPeak = (hr >= 8 && hr <= 10) || (hr >= 17 && hr <= 20);
    
    if (isPeak) {
      if (!peakStatsByRoute[record.route_name]) {
        peakStatsByRoute[record.route_name] = { total: 0, count: 0, sample_data: [] };
      }
      peakStatsByRoute[record.route_name].total += record.congestion;
      peakStatsByRoute[record.route_name].count += 1;
      if (peakStatsByRoute[record.route_name].sample_data.length < 5) {
        peakStatsByRoute[record.route_name].sample_data.push(record);
      }
    }
  });

  const recommendations = [];
  
  for (const [route_name, stats] of Object.entries(peakStatsByRoute)) {
    const avgCongestion = stats.total / stats.count;
    if (avgCongestion > 70) {
      // High peak hour congestion triggers recommendation
      const suggestion = await generateRecommendation(route_name, stats.sample_data);
      recommendations.push({
        id: `rec-${route_name}`,
        route_name,
        issue: `Severe peak-hour congestion (Avg ${Math.round(avgCongestion)}/100)`,
        suggestion,
        supporting_data: stats.sample_data
      });
    }
  }

  res.json(recommendations);
});

export default router;
