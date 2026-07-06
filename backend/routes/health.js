import express from 'express';
import { getTrafficData } from '../lib/db.js';

const router = express.Router();

// AQI banding (US EPA style).
const aqiBand = (aqi) => {
  if (aqi <= 50) return { label: 'Good', rank: 0 };
  if (aqi <= 100) return { label: 'Moderate', rank: 1 };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', rank: 2 };
  if (aqi <= 200) return { label: 'Unhealthy', rank: 3 };
  return { label: 'Very Unhealthy', rank: 4 };
};

// GET /api/advisories
// Second domain: Environmental + Community Wellness. Cross-references air
// quality (AQI) with peak traffic congestion per corridor to produce a
// health advisory for vulnerable groups — mapping directly to the challenge's
// "Healthcare Access and Community Wellness" solution area. Rule-based and
// deterministic so it runs without cloud credentials.
router.get('/advisories', async (req, res) => {
  const data = await getTrafficData();

  const byRoute = {};
  for (const r of data) {
    if (!byRoute[r.route_name]) {
      byRoute[r.route_name] = {
        route_name: r.route_name,
        aqiSum: 0, aqiN: 0, aqiMax: 0,
        peakCongSum: 0, peakN: 0,
        worst: null,
      };
    }
    const s = byRoute[r.route_name];
    if (typeof r.aqi === 'number') {
      s.aqiSum += r.aqi;
      s.aqiN += 1;
      if (r.aqi > s.aqiMax) s.aqiMax = r.aqi;
      if (!s.worst || r.aqi > s.worst.aqi) s.worst = { aqi: r.aqi, timestamp: r.timestamp };
    }
    const h = new Date(r.timestamp).getHours();
    const isPeak = (h >= 8 && h <= 10) || (h >= 17 && h <= 20);
    if (isPeak) {
      s.peakCongSum += r.congestion;
      s.peakN += 1;
    }
  }

  const advisories = Object.values(byRoute)
    .map((s) => {
      const avgAqi = s.aqiN ? Math.round(s.aqiSum / s.aqiN) : null;
      if (avgAqi == null) return null;
      const peakCongestion = s.peakN ? Math.round(s.peakCongSum / s.peakN) : 0;
      const band = aqiBand(s.aqiMax);

      // Combined risk: elevated pollution amplified by heavy idling traffic.
      let riskScore = band.rank;
      if (peakCongestion >= 70 && band.rank >= 1) riskScore += 1; // congestion amplifies exposure
      const risk_level = ['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'SEVERE'][
        Math.min(riskScore, 4)
      ];

      const groups =
        band.rank >= 2
          ? ['children', 'elderly', 'respiratory & cardiac patients', 'outdoor workers']
          : band.rank === 1
          ? ['sensitive individuals', 'respiratory patients']
          : ['general public: no restrictions'];

      let advisory;
      if (band.rank >= 3) {
        advisory = `Peak AQI ${s.aqiMax} (${band.label}) on ${s.route_name}. Advise vulnerable groups to avoid outdoor activity during the ${peakHourWindow(peakCongestion)} window; consider school outdoor-activity caution and rerouting idling traffic.`;
      } else if (band.rank === 2) {
        advisory = `Peak AQI ${s.aqiMax} (${band.label}) on ${s.route_name}. Sensitive groups should limit prolonged outdoor exertion; congestion (${peakCongestion}/100) is concentrating tailpipe emissions at peak hours.`;
      } else if (band.rank === 1) {
        advisory = `AQI on ${s.route_name} is moderate (peak ${s.aqiMax}). Unusually sensitive individuals should watch for symptoms; otherwise conditions are acceptable.`;
      } else {
        advisory = `Air quality on ${s.route_name} is good (peak AQI ${s.aqiMax}). No health precautions required.`;
      }

      return {
        id: `adv-${s.route_name}`,
        route_name: s.route_name,
        avg_aqi: avgAqi,
        peak_aqi: s.aqiMax,
        aqi_category: band.label,
        peak_congestion: peakCongestion,
        risk_level,
        vulnerable_groups: groups,
        advisory,
        worst_reading: s.worst,
      };
    })
    .filter(Boolean)
    // Most severe first.
    .sort((a, b) => b.peak_aqi - a.peak_aqi);

  res.json(advisories);
});

const peakHourWindow = (peakCongestion) =>
  peakCongestion >= 70 ? '8-10 AM and 5-8 PM' : 'midday';

export default router;
