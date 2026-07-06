import express from 'express';
import { getTrafficData } from '../lib/db.js';
import { generateOneLiner } from '../lib/gemini.js';

const router = express.Router();

const WARDS = [
  { ward: 'MG Road', aqi: 72, waste_efficiency: 68, incident_rate: '14/mo' },
  { ward: 'Indiranagar', aqi: 58, waste_efficiency: 82, incident_rate: '6/mo' },
  { ward: 'Koramangala', aqi: 65, waste_efficiency: 74, incident_rate: '9/mo' },
  { ward: 'Hebbal', aqi: 78, waste_efficiency: 55, incident_rate: '21/mo' },
  { ward: 'Jayanagar', aqi: 52, waste_efficiency: 88, incident_rate: '3/mo' },
];

const INTERPRETATIONS = [
  'Moderate livability — traffic and AQI need attention.',
  'High livability score — green cover and low incidents.',
  'Good livability with room for waste management improvement.',
  'Below-average livability — high congestion and AQI concerns.',
  'Excellent livability — clean air and efficient services.',
];

router.get('/livability', async (req, res) => {
  const traffic = await getTrafficData();
  const routeCongestion = {};
  traffic.forEach(t => {
    if (!routeCongestion[t.route_name]) routeCongestion[t.route_name] = [];
    routeCongestion[t.route_name].push(t.congestion);
  });

  const wardScores = await Promise.all(WARDS.map(async (w, i) => {
    const congestion = routeCongestion[w.ward] || [];
    const avgCong = congestion.length > 0
      ? Math.round(congestion.reduce((a, c) => a + c, 0) / congestion.length)
      : 50;
    const aqiScore = Math.max(0, 100 - w.aqi);
    const wasteScore = w.waste_efficiency;
    const congestionScore = Math.max(0, 100 - avgCong);
    const livability = Math.round((aqiScore + wasteScore + congestionScore) / 3);

    const defaultInterpretation = INTERPRETATIONS[i % INTERPRETATIONS.length];
    const prompt = `You are a city planner writing a one-line evaluation for Ward ${w.ward}. 
Livability score is ${livability}/100. Average AQI is ${w.aqi}, waste efficiency is ${w.waste_efficiency}%, and average congestion is ${avgCong}/100.
Write exactly one short, punchy sentence explaining what the main factor is. Keep it under 15 words.`;

    const interpretation = await generateOneLiner(prompt, defaultInterpretation);

    return {
      ...w,
      livability_score: livability,
      interpretation,
    };
  }));

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

  const advisories = await Promise.all(Object.entries(routeStats).map(async ([route, stats], i) => {
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

    const defaultAdvisory = peakCong > 70
      ? `High congestion (${peakCong}/100) combined with AQI ${peakAqi}. Limit outdoor exposure during peak hours.`
      : `AQI at ${peakAqi} (${aqiCat}). Consider masks if outdoors for extended periods.`;

    const prompt = `Write a short, direct health or transit advisory for a commuter on route ${route}.
Peak congestion is ${peakCong}/100 and peak AQI is ${peakAqi}.
Write exactly one sentence. Keep it under 20 words.`;

    const advisory = await generateOneLiner(prompt, defaultAdvisory);

    return {
      id: `adv-${route}-${i}`,
      route_name: route,
      risk_level: riskLevel,
      peak_aqi: peakAqi,
      aqi_category: aqiCat,
      peak_congestion: peakCong,
      advisory,
      vulnerable_groups: groups,
    };
  }));

  res.json(advisories);
});

export default router;
