import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getTrafficData } from '../lib/db.js';
import { generateOneLiner } from '../lib/gemini.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadEnvFile = async () => {
  try {
    return JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'environment.json'), 'utf-8'));
  } catch {
    return [];
  }
};

const loadIncidentsFile = async () => {
  try {
    return JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'incidents.json'), 'utf-8'));
  } catch {
    return [];
  }
};

router.get('/livability', async (req, res) => {
  const traffic = await getTrafficData();
  const env = await loadEnvFile();
  const incidents = await loadIncidentsFile();

  const routeCongestion = {};
  traffic.forEach(t => {
    if (!routeCongestion[t.route_name]) routeCongestion[t.route_name] = [];
    routeCongestion[t.route_name].push(t.congestion);
  });

  const latestEnv = {};
  env.forEach(e => {
    if (!latestEnv[e.wardId] || new Date(e.timestamp) > new Date(latestEnv[e.wardId].timestamp)) {
      latestEnv[e.wardId] = e;
    }
  });

  const wardIncidents = {};
  incidents.forEach(inc => {
    const mapping = { 'Hazratganj': 'MG Road', 'Gomti Nagar': 'Indiranagar', 'Alambagh': 'Koramangala', 'Indira Nagar': 'Hebbal', 'Aminabad': 'Koramangala', 'Chowk': 'MG Road' };
    const mappedWard = mapping[inc.ward] || inc.ward;
    if (!wardIncidents[mappedWard]) wardIncidents[mappedWard] = 0;
    wardIncidents[mappedWard] += 1;
  });

  const wardNames = [...new Set([...Object.keys(latestEnv), ...Object.keys(routeCongestion), ...Object.keys(wardIncidents)])];
  const wardScores = await Promise.all(wardNames.map(async (ward) => {
    const congestion = routeCongestion[ward] || [];
    const avgCong = congestion.length > 0
      ? Math.round(congestion.reduce((a, c) => a + c, 0) / congestion.length)
      : 50;
    const envData = latestEnv[ward];
    const aqi = envData?.aqi || 50;
    const wasteEfficiency = envData?.waste_collection_efficiency_pct || 50;
    const waterQuality = envData?.water_quality_index || 50;
    const incidentCount = wardIncidents[ward] || 0;

    const aqiScore = Math.max(0, 100 - aqi);
    const wasteScore = wasteEfficiency;
    const congestionScore = Math.max(0, 100 - avgCong);
    const safetyScore = Math.max(0, 100 - Math.min(100, incidentCount * 10));
    const waterScore = waterQuality;
    const livability = Math.round((aqiScore + wasteScore + congestionScore + safetyScore + waterScore) / 5);

    const prompt = `Interpret this ward livability score of ${livability}/100 for ${ward} given AQI ${aqi}, congestion ${avgCong}/100, waste efficiency ${wasteEfficiency}%, water quality ${waterQuality}/100, and ${incidentCount} incidents. One sentence only.`;
    const fallback = `${ward} scores ${livability}/100 — ${livability >= 75 ? 'high' : livability >= 50 ? 'moderate' : 'needs improvement'} livability across all five domains.`;
    const interpretation = await generateOneLiner(prompt, fallback);

    return {
      ward,
      aqi,
      waste_efficiency: wasteEfficiency,
      water_quality: waterQuality,
      incident_rate: `${incidentCount}/mo`,
      livability_score: livability,
      interpretation,
    };
  }));

  wardScores.sort((a, b) => b.livability_score - a.livability_score);
  res.json(wardScores);
});

router.get('/advisories', async (req, res) => {
  const traffic = await getTrafficData();
  const routeStats = {};
  traffic.forEach(t => {
    if (!routeStats[t.route_name]) routeStats[t.route_name] = { aqi: [], congestion: [] };
    routeStats[t.route_name].aqi.push(t.aqi || 50);
    routeStats[t.route_name].congestion.push(t.congestion);
  });

  const advisories = Object.entries(routeStats).map(([route, stats], i) => {
    const peakAqi = Math.round(stats.aqi.reduce((a, b) => Math.max(a, b), 0));
    const peakCong = Math.round(stats.congestion.reduce((a, b) => Math.max(a, b), 0));
    const avgAqi = Math.round(stats.aqi.reduce((a, b) => a + b, 0) / stats.aqi.length);
    let riskLevel = 'LOW';
    if (peakAqi > 150 || peakCong > 90) riskLevel = 'SEVERE';
    else if (peakAqi > 100 || peakCong > 80) riskLevel = 'HIGH';
    else if (peakAqi > 70 || peakCong > 65) riskLevel = 'ELEVATED';
    else if (peakAqi > 50 || peakCong > 50) riskLevel = 'MODERATE';

    const aqiCat = avgAqi <= 50 ? 'Good' : avgAqi <= 100 ? 'Moderate' : avgAqi <= 150 ? 'Unhealthy (Sensitive)' : 'Unhealthy';
    const groups = riskLevel === 'HIGH' || riskLevel === 'SEVERE'
      ? ['Elderly', 'Children', 'Respiratory patients']
      : ['Sensitive groups'];

    return {
      id: `adv-${route}-${i}`,
      route_name: route,
      risk_level: riskLevel,
      peak_aqi: peakAqi,
      aqi_category: aqiCat,
      peak_congestion: peakCong,
      advisory: peakCong > 70
        ? `High congestion (${peakCong}/100) combined with AQI ${peakAqi}. Limit outdoor exposure during peak hours.`
        : `AQI at ${peakAqi} (${aqiCat}). Consider masks if outdoors for extended periods.`,
      vulnerable_groups: groups,
    };
  });

  res.json(advisories);
});

export default router;
