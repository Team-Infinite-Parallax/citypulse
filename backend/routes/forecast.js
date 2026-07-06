import express from 'express';
import { generateRecommendation } from '../lib/gemini.js';
import { getTrafficData } from '../lib/db.js';

const router = express.Router();

// GET /api/alerts
// Returns anomalies (congestion > 90 or has incident notes)
router.get('/alerts', async (req, res) => {
  const data = await getTrafficData();
  
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
  const data = await getTrafficData();
  
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

  const highCongestionRoutes = Object.entries(peakStatsByRoute)
    .filter(([, stats]) => (stats.total / stats.count) > 70);

  const recResults = await Promise.all(
    highCongestionRoutes.map(async ([route_name, stats]) => {
      const avgCongestion = stats.total / stats.count;
      const suggestion = await generateRecommendation(route_name, stats.sample_data);
      return {
        id: `rec-${route_name}`,
        route_name,
        issue: `Severe peak-hour congestion (Avg ${Math.round(avgCongestion)}/100)`,
        suggestion,
        supporting_data: stats.sample_data
      };
    })
  );

  res.json(recResults);
});

// GET /api/forecast
// Simple time-series forecast (SMA) for next 3 hours based on recent data
router.get('/forecast', async (req, res) => {
  const data = await getTrafficData();
  const routes = [...new Set(data.map(d => d.route_name))];
  
  const forecasts = routes.map(route => {
    const routeData = data.filter(d => d.route_name === route).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    if (routeData.length < 3) return null;
    
    // Simple Moving Average (window=3)
    const recent = routeData.slice(-3);
    const avgCongestion = recent.reduce((sum, r) => sum + r.congestion, 0) / 3;
    const avgDelay = recent.reduce((sum, r) => sum + r.delay_minutes, 0) / 3;
    
    // Naive trend
    const trend = recent[2].congestion - recent[0].congestion;
    
    return {
      route_name: route,
      predicted_congestion: Math.max(0, Math.min(100, Math.round(avgCongestion + trend))),
      predicted_delay: Math.max(0, Math.round(avgDelay + (trend > 0 ? 2 : -2))),
      trend: trend > 0 ? 'increasing' : (trend < 0 ? 'decreasing' : 'stable')
    };
  }).filter(Boolean);

  res.json(forecasts);
});

export default router;
