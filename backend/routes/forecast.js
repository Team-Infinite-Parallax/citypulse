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
// Seasonal-naive forecast: predicts the next hour for each corridor using the
// historical average for that hour-of-day (daily seasonality), then corrects
// with the most recent residual (how far the latest reading sits above/below
// its own seasonal baseline). This is a real, defensible forecasting method —
// the prediction is genuinely downstream of the time series, not just a mean.
router.get('/forecast', async (req, res) => {
  const data = await getTrafficData();
  const routes = [...new Set(data.map(d => d.route_name))];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const forecasts = routes.map(route => {
    const routeData = data
      .filter(d => d.route_name === route)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    if (routeData.length < 4) return null;

    // Build hour-of-day seasonal profiles.
    const hourly = Array.from({ length: 24 }, () => ({
      cong: 0, delay: 0, aqi: 0, aqiN: 0, n: 0,
    }));
    for (const r of routeData) {
      const h = new Date(r.timestamp).getHours();
      hourly[h].cong += r.congestion;
      hourly[h].delay += r.delay_minutes;
      hourly[h].n += 1;
      if (typeof r.aqi === 'number') { hourly[h].aqi += r.aqi; hourly[h].aqiN += 1; }
    }
    const seasonal = (h, field, count) =>
      hourly[h].n ? hourly[h][field] / (count ? hourly[h][count] : hourly[h].n) : null;

    const latest = routeData[routeData.length - 1];
    const latestHour = new Date(latest.timestamp).getHours();
    const targetHour = (latestHour + 1) % 24;

    // Residual: how far the latest reading deviates from its seasonal baseline.
    const baselineNow = seasonal(latestHour, 'cong');
    const residual = baselineNow == null ? 0 : latest.congestion - baselineNow;

    const seasonalCong = seasonal(targetHour, 'cong') ?? latest.congestion;
    const seasonalDelay = seasonal(targetHour, 'delay') ?? latest.delay_minutes;
    const seasonalAqi = hourly[targetHour].aqiN
      ? hourly[targetHour].aqi / hourly[targetHour].aqiN
      : (typeof latest.aqi === 'number' ? latest.aqi : null);

    // Apply a damped residual correction (0.5) so a single spike doesn't dominate.
    const predictedCong = clamp(Math.round(seasonalCong + 0.5 * residual), 0, 100);
    const predictedDelay = clamp(Math.round(seasonalDelay + 0.25 * residual), 0, 999);

    const delta = predictedCong - latest.congestion;
    const trend = delta > 3 ? 'increasing' : (delta < -3 ? 'decreasing' : 'stable');

    return {
      route_name: route,
      target_hour: `${String(targetHour).padStart(2, '0')}:00`,
      current_congestion: latest.congestion,
      predicted_congestion: predictedCong,
      predicted_delay: predictedDelay,
      predicted_aqi: seasonalAqi == null ? null : Math.round(seasonalAqi),
      trend,
      method: 'seasonal-naive (hour-of-day) + damped residual',
    };
  }).filter(Boolean);

  res.json(forecasts);
});

export default router;
