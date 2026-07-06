import express from 'express';
import { generateOneLiner, generateStructured } from '../lib/gemini.js';
import { getTrafficData } from '../lib/db.js';
import { getIncidents } from '../lib/firestore.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadEnvData = async () => {
  try {
    return JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'environment.json'), 'utf-8'));
  } catch { return []; }
};

const loadIncidents = async () => {
  try {
    return JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'incidents.json'), 'utf-8'));
  } catch { return []; }
};

const TOURISM_POI = [
  { name: 'MG Road Shopping District', ward: 'MG Road', category: 'shopping', footfall: 8500, rating: 4.2 },
  { name: 'Indiranagar 100ft Road', ward: 'Indiranagar', category: 'dining', footfall: 7200, rating: 4.5 },
  { name: 'Koramangala Food Street', ward: 'Koramangala', category: 'dining', footfall: 6400, rating: 4.4 },
  { name: 'Lalbagh Botanical Garden', ward: 'Jayanagar', category: 'park', footfall: 5200, rating: 4.6 },
  { name: 'Cubbon Park', ward: 'MG Road', category: 'park', footfall: 4800, rating: 4.7 },
];

const ENERGY_DATA = [
  { ward: 'MG Road', solar_adoption_pct: 12, green_pct: 18 },
  { ward: 'Indiranagar', solar_adoption_pct: 24, green_pct: 31 },
  { ward: 'Koramangala', solar_adoption_pct: 18, green_pct: 22 },
  { ward: 'Hebbal', solar_adoption_pct: 8, green_pct: 12 },
  { ward: 'Jayanagar', solar_adoption_pct: 32, green_pct: 38 },
];

// ADK-style multi-step agentic planner
// Each "plan" is a sequence of tool calls (data retrievals) synthesized by Gemini
const PLAN_TYPES = {
  'ideal_commute': async () => {
    const traffic = await getTrafficData();
    const env = await loadEnvData();
    const routeCong = {};
    const routeAqi = {};
    traffic.forEach(t => {
      if (!routeCong[t.route_name]) routeCong[t.route_name] = [];
      routeCong[t.route_name].push(t.congestion);
      if (t.aqi) {
        if (!routeAqi[t.route_name]) routeAqi[t.route_name] = [];
        routeAqi[t.route_name].push(t.aqi);
      }
    });
    const results = Object.entries(routeCong).map(([route, vals]) => {
      const avgCong = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
      const aqiVals = routeAqi[route] || [];
      const avgAqi = aqiVals.length ? Math.round(aqiVals.reduce((a, b) => a + b, 0) / aqiVals.length) : 50;
      return { route, avg_congestion: avgCong, avg_aqi: avgAqi, combined_score: Math.round((avgCong + avgAqi) / 2) };
    }).sort((a, b) => a.combined_score - b.combined_score);

    const top3 = results.slice(0, 3);
    const fallback = `Based on multi-domain analysis, the best commute corridors (lowest combined congestion + AQI) are: ${top3.map(r => `${r.route} (congestion: ${r.avg_congestion}, AQI: ${r.avg_aqi})`).join(', ')}.`;
    const prompt = `As a city planning AI, analyze this multi-domain commute data and recommend the best 3 corridors for commuting based on LOW congestion AND LOW AQI (combined score = avg of both). For each, explain WHY it ranks well. Data: ${JSON.stringify(results.slice(0, 5))}. Respond as JSON: { "top_choices": [{ "route": string, "reason": string, "congestion": number, "aqi": number }], "summary": "one-sentence overall recommendation" }`;

    const structured = await generateStructured(prompt, { top_choices: top3.map(r => ({ route: r.route, reason: `Lowest combined congestion (${r.avg_congestion}) and AQI (${r.avg_aqi})`, congestion: r.avg_congestion, aqi: r.avg_aqi })), summary: fallback });
    return structured;
  },

  'disaster_preparedness': async () => {
    const incidents = await loadIncidents();
    const traffic = await getTrafficData();
    const env = await loadEnvData();

    const byWard = {};
    incidents.forEach(inc => {
      if (!byWard[inc.ward]) byWard[inc.ward] = { ward: inc.ward, incidents: [], critical_count: 0 };
      byWard[inc.ward].incidents.push(inc);
      if (inc.severity === 'CRITICAL' || inc.severity === 'HIGH') byWard[inc.ward].critical_count += 1;
    });

    const envByWard = {};
    env.forEach(e => { envByWard[e.wardId] = e; });

    const wardAssessments = Object.values(byWard).map(w => ({
      ward: w.ward,
      total_incidents: w.incidents.length,
      critical_incidents: w.critical_count,
      aqi: envByWard[w.ward]?.aqi || 50,
      waste_efficiency: envByWard[w.ward]?.waste_collection_efficiency_pct || 50,
    })).sort((a, b) => b.critical_incidents - a.critical_incidents);

    const topPriority = wardAssessments.slice(0, 3);
    const fallback = `Priority wards for disaster preparedness: ${topPriority.map(w => `${w.ward} (${w.critical_incidents} critical incidents, AQI: ${w.aqi})`).join(', ')}.`;
    const prompt = `As a disaster response AI, assess these wards for emergency preparedness priority based on incident frequency, severity, and environmental factors. Identify the top 3 wards needing most attention. Data: ${JSON.stringify(wardAssessments.slice(0, 6))}. Respond as JSON: { "priority_wards": [{ "ward": string, "risk_score": number(0-100), "reason": string, "recommended_action": string }], "summary": string }`;

    const structured = await generateStructured(prompt, {
      priority_wards: topPriority.map(w => ({ ward: w.ward, risk_score: Math.min(100, w.critical_incidents * 25), reason: `${w.critical_incidents} critical incidents, AQI ${w.aqi}`, recommended_action: 'Increase emergency resource allocation' })),
      summary: fallback,
    });
    return structured;
  },

  'simulate_impact': async () => {
    const env = await loadEnvData();
    const traffic = await getTrafficData();
    const incidents = await loadIncidents();

    const wardMetrics = {};
    env.forEach(e => {
      wardMetrics[e.wardId] = { ...wardMetrics[e.wardId], aqi: e.aqi, waste: e.waste_collection_efficiency_pct };
    });
    Object.values(wardMetrics).forEach(w => {
      if (w.waste != null) {
        const improvedWaste = Math.min(100, w.waste + 20);
        const aqiImprovement = Math.max(0, w.aqi - Math.round((improvedWaste - w.waste) * 0.3));
        w.simulated_aqi = aqiImprovement;
        w.improvement = w.aqi - aqiImprovement;
      }
    });

    const fallback = `Simulating 20% improvement in waste collection across all wards: average AQI reduction of ${Math.round(Object.values(wardMetrics).reduce((s, w) => s + (w.improvement || 0), 0) / Math.max(1, Object.keys(wardMetrics).length))} points projected.`;
    const prompt = `Simulate the impact of improving waste collection efficiency by 20% across all wards. Analyze how this affects AQI (air quality) and overall livability. Data: ${JSON.stringify(wardMetrics)}. Respond as JSON: { "simulation": [{ "ward": string, "current_aqi": number, "projected_aqi": number, "improvement": number }], "summary": string, "policy_recommendation": string }`;

    const structured = await generateStructured(prompt, {
      simulation: Object.entries(wardMetrics).map(([ward, w]) => ({ ward, current_aqi: w.aqi || 50, projected_aqi: w.simulated_aqi || 50, improvement: w.improvement || 0 })),
      summary: fallback,
      policy_recommendation: 'Prioritize waste management infrastructure in wards with highest AQI to maximize health co-benefits.',
    });
    return structured;
  },

  'tourism_hotspots': async () => {
    const traffic = await getTrafficData();
    const wardCong = {};
    traffic.forEach(t => {
      if (!wardCong[t.route_name]) wardCong[t.route_name] = [];
      wardCong[t.route_name].push(t.congestion);
    });

    const poisWithCong = TOURISM_POI.map(poi => ({
      ...poi,
      avg_congestion: wardCong[poi.ward] ? Math.round(wardCong[poi.ward].reduce((a, b) => a + b, 0) / wardCong[poi.ward].length) : 50,
      accessibility_score: wardCong[poi.ward] ? Math.max(0, 100 - Math.round(wardCong[poi.ward].reduce((a, b) => a + b, 0) / wardCong[poi.ward].length)) : 50,
    })).sort((a, b) => (b.rating * 10 + b.accessibility_score) - (a.rating * 10 + a.accessibility_score));

    const topPois = poisWithCong.slice(0, 4);
    const fallback = `Top tourism hotspots by popularity and accessibility: ${topPois.map(p => `${p.name} (rating ${p.rating}, accessibility ${p.accessibility_score}/100)`).join(', ')}.`;
    const prompt = `As a tourism development AI, rank these points of interest by their potential for local economic development. Consider rating, footfall, and accessibility (lower congestion = higher accessibility). Data: ${JSON.stringify(poisWithCong)}. Respond as JSON: { "top_hotspots": [{ "name": string, "rank": number, "potential_score": number, "recommendation": string }], "summary": string }`;

    const structured = await generateStructured(prompt, {
      top_hotspots: topPois.map((p, i) => ({ name: p.name, rank: i + 1, potential_score: Math.round(p.rating * 20 + p.accessibility_score * 0.8), recommendation: `Improve connectivity to ${p.name} for tourism boost` })),
      summary: fallback,
    });
    return structured;
  },
};

// POST /api/plan — multi-step agentic planning
router.post('/', async (req, res) => {
  const { plan_type } = req.body || {};
  const validTypes = Object.keys(PLAN_TYPES);

  if (!validTypes.includes(plan_type)) {
    return res.status(400).json({ error: `Unknown plan type. Choose one of: ${validTypes.join(', ')}` });
  }

  try {
    const result = await PLAN_TYPES[plan_type]();
    res.json({ plan_type, ...result, executed_at: new Date().toISOString() });
  } catch (error) {
    console.error(`[Plan] Error executing ${plan_type}:`, error.message);
    res.status(500).json({ error: 'Failed to execute planning workflow', plan_type });
  }
});

// GET /api/plan/types — list available plan types
router.get('/types', (req, res) => {
  res.json(Object.keys(PLAN_TYPES).map(key => ({
    id: key,
    label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: {
      ideal_commute: 'Finds the best commute corridor by combining traffic and AQI data',
      disaster_preparedness: 'Identifies wards needing priority disaster response resources',
      simulate_impact: 'Simulates how waste collection improvements affect AQI across wards',
      tourism_hotspots: 'Ranks tourism POIs by popularity, accessibility, and economic potential',
    }[key],
  })));
});

export default router;