import express from 'express';
import { generateRecommendation } from '../lib/gemini.js';
import { getTrafficData } from '../lib/db.js';
import { forecastSeries, forecastSeriesML } from '../lib/forecast.js';
import { detectAnomalies } from '../lib/anomaly.js';

const router = express.Router();

// Short display label for an hourly timestamp, e.g. "Mon 14:00".
const hourLabel = (iso) => {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-US', { weekday: 'short' });
  return `${day} ${String(d.getHours()).padStart(2, '0')}:00`;
};

// GET /api/alerts
// Anomalies surfaced via the SHARED rolling-baseline detector (lib/anomaly.js) —
// the same code path the Public Safety module uses — plus explicit incident
// notes. Each alert carries an explainability payload (why it fired).
router.get('/alerts', async (req, res) => {
  const data = await getTrafficData();

  // Statistical spikes vs each corridor's own trailing baseline.
  const spikes = detectAnomalies(data, {
    groupBy: 'route_name',
    value: 'congestion',
    timestamp: 'timestamp',
    window: 24,
    z: 2,
    minBaseline: 6,
  });
  const spikeById = new Map(spikes.map((s) => [`${s.key}-${s.timestamp}`, s]));

  const confLabel = (c) => (c >= 0.75 ? 'high' : c >= 0.5 ? 'medium' : 'low');
  const alerts = [];

  for (const record of data) {
    const id = `${record.route_name}-${record.timestamp}`;
    const spike = spikeById.get(id);
    const hasIncident = record.notes && record.notes.toLowerCase().includes('incident');
    const highThreshold = record.congestion > 90;
    if (!spike && !hasIncident && !highThreshold) continue;

    const critical =
      (spike && (spike.severity === 'CRITICAL' || spike.severity === 'HIGH')) ||
      record.congestion > 95;

    let message;
    let explain;
    if (spike) {
      message = `Congestion ${spike.value}/100 is ${spike.zscore}σ above ${spike.key}'s rolling baseline (${spike.baseline}).`;
      explain = {
        confidence: spike.confidence,
        confidence_label: confLabel(spike.confidence),
        rationale: `Flagged because congestion (${spike.value}) sits ${spike.zscore} standard deviations above this corridor's trailing baseline of ${spike.baseline} ± ${spike.std}.`,
        sources: [record, { baseline: spike.baseline, std: spike.std, zscore: spike.zscore }],
        method: 'rolling-baseline z-score (shared anomaly detector)',
      };
    } else if (hasIncident) {
      message = record.notes;
      explain = {
        confidence: 0.9,
        confidence_label: 'high',
        rationale: `Flagged because an incident was explicitly logged for ${record.route_name} at this timestamp.`,
        sources: [record],
        method: 'logged incident note',
      };
    } else {
      message = `Severe congestion detected (${record.congestion}/100).`;
      explain = {
        confidence: 0.7,
        confidence_label: 'medium',
        rationale: `Flagged because congestion (${record.congestion}) exceeded the absolute severe-congestion threshold of 90/100.`,
        sources: [record],
        method: 'absolute threshold (>90/100)',
      };
    }

    alerts.push({
      id,
      route_name: record.route_name,
      timestamp: record.timestamp,
      severity: critical ? 'CRITICAL' : 'WARNING',
      message,
      metrics: { congestion: record.congestion, delay: record.delay_minutes },
      explain,
    });
  }

  // Latest first.
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
    .filter(([, stats]) => (stats.total / stats.count) > 50);

  const recResults = await Promise.all(
    highCongestionRoutes.map(async ([route_name, stats]) => {
      const avgCongestion = stats.total / stats.count;
      const rec = await generateRecommendation(route_name, stats.sample_data);
      const confidence = Math.min(1, Number((avgCongestion / 100).toFixed(2)));
      return {
        id: `rec-${route_name}`,
        route_name,
        issue: `Severe peak-hour congestion (Avg ${Math.round(avgCongestion)}/100)`,
        suggestion: rec.suggestion,
        supporting_data: stats.sample_data,
        // Explainability contract (Task 1.2).
        explain: {
          confidence,
          confidence_label: avgCongestion >= 80 ? 'high' : avgCongestion >= 70 ? 'medium' : 'low',
          rationale: rec.rationale,
          sources: stats.sample_data,
          method: 'peak-hour congestion aggregation (avg over 08:00–10:00 & 17:00–20:00)',
        },
      };
    })
  );

  res.json(recResults);
});

// GET /api/forecast?h=6
// Real time-series forecasting per corridor using additive Holt-Winters
// exponential smoothing (level + trend + daily seasonality). Returns point
// forecasts AND a prediction interval (lower/upper bound) for the next N hours,
// so the UI can render a genuine uncertainty band — not a bare line.
router.get('/forecast', async (req, res) => {
  const data = await getTrafficData();
  const horizon = Math.max(1, Math.min(24, parseInt(req.query.h, 10) || 6));
  const routes = [...new Set(data.map((d) => d.route_name))];

  const forecasts = routes
    .map((route) => {
      const routeData = data
        .filter((d) => d.route_name === route)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      if (routeData.length < 4) return null;

      const congestion = routeData.map((r) => r.congestion);
      const aqiSeries = routeData.map((r) =>
        typeof r.aqi === 'number' ? r.aqi : null
      );

      const baselineCong = forecastSeries(congestion, {
        period: 24,
        horizon,
        clamp: [0, 100],
      });
      const mlCong = forecastSeriesML(congestion, {
        period: 24,
        horizon,
        clamp: [0, 100],
      });
      const chosenCong =
        mlCong.inSampleRmse < baselineCong.inSampleRmse
          ? { ...mlCong, selected_model: 'ml' }
          : { ...baselineCong, selected_model: 'statistical' };

      const hasAqi = aqiSeries.every((v) => v != null);
      const aqi = hasAqi
        ? forecastSeries(aqiSeries, { period: 24, horizon, clamp: [0, 500] })
        : null;

      // Delay tracks congestion; scale the forecast by the observed ratio
      // rather than fitting a second model to a near-collinear series.
      const totalCong = congestion.reduce((s, v) => s + v, 0);
      const totalDelay = routeData.reduce((s, r) => s + r.delay_minutes, 0);
      const delayRatio = totalCong > 0 ? totalDelay / totalCong : 0;

      const latest = routeData[routeData.length - 1];
      const lastTs = new Date(latest.timestamp).getTime();
      const HOUR = 3600 * 1000;

      const forecast_series = chosenCong.point.map((p, k) => {
        const ts = new Date(lastTs + (k + 1) * HOUR).toISOString();
        return {
          ts,
          label: hourLabel(ts),
          forecast: p,
          lower: chosenCong.lower[k],
          upper: chosenCong.upper[k],
        };
      });

      // Recent actuals for chart context (up to two days).
      const history = routeData.slice(-48).map((r) => ({
        ts: r.timestamp,
        label: hourLabel(r.timestamp),
        congestion: r.congestion,
        aqi: typeof r.aqi === 'number' ? r.aqi : null,
      }));

      const avgForecast =
        chosenCong.point.reduce((s, v) => s + v, 0) / chosenCong.point.length;
      const delta = avgForecast - latest.congestion;
      const trend = delta > 3 ? 'increasing' : delta < -3 ? 'decreasing' : 'stable';

      return {
        route_name: route,
        method: `${chosenCong.method} · selected by RMSE (${chosenCong.selected_model}) · 90% prediction interval`,
        horizon_hours: horizon,
        params: chosenCong.params,
        residual_std: chosenCong.residualStd,
        model_choice: chosenCong.selected_model,
        baseline_rmse: baselineCong.inSampleRmse,
        ml_rmse: mlCong.inSampleRmse,
        current_congestion: latest.congestion,
        // Legacy convenience fields (first forecast step).
        predicted_congestion: chosenCong.point[0],
        target_hour: `${String(new Date(forecast_series[0].ts).getHours()).padStart(2, '0')}:00`,
        predicted_delay: Math.max(0, Math.round(chosenCong.point[0] * delayRatio)),
        predicted_aqi: aqi ? aqi.point[0] : null,
        trend,
        // Real forecasting deliverable: arrays with an uncertainty band.
        forecast: chosenCong.point,
        lower_bound: chosenCong.lower,
        upper_bound: chosenCong.upper,
        forecast_series,
        history,
      };
    })
    .filter(Boolean);

  res.json(forecasts);
});

export default router;
