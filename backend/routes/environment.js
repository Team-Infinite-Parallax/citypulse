import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateOneLiner } from '../lib/gemini.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENV_FILE = path.join(__dirname, '..', 'data', 'environment.json');

export const getEnvironmentData = async () => {
  try {
    const data = await fs.readFile(ENV_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading environment.json:', err);
    return [];
  }
};

// GET /api/environment/livability
router.get('/livability', async (req, res) => {
  const envData = await getEnvironmentData();
  
  // Also get incidents to calculate incident rate
  let incidentRateByWard = {};
  try {
    const INCIDENTS_FILE = path.join(__dirname, '..', 'data', 'incidents.json');
    const incData = await fs.readFile(INCIDENTS_FILE, 'utf-8');
    const incidents = JSON.parse(incData);
    incidents.forEach(inc => {
      if (!incidentRateByWard[inc.ward]) {
        incidentRateByWard[inc.ward] = 0;
      }
      incidentRateByWard[inc.ward]++;
    });
  } catch (err) {
    console.error('Error reading incidents for livability:', err);
  }

  // Get the latest env record for each ward
  const latestEnvByWard = {};
  envData.forEach(record => {
    if (!latestEnvByWard[record.wardId] || new Date(record.timestamp) > new Date(latestEnvByWard[record.wardId].timestamp)) {
      latestEnvByWard[record.wardId] = record;
    }
  });

  const results = [];
  
  for (const ward of Object.keys(latestEnvByWard)) {
    const env = latestEnvByWard[ward];
    const incidentCount = incidentRateByWard[ward] || 0;
    
    // Composite score logic
    // AQI (lower is better): normalize 0-500 to 0-100 (where 100 is best)
    const aqiScore = Math.max(0, 100 - (env.aqi / 500) * 100);
    // Waste efficiency: already 0-100
    const wasteScore = env.waste_collection_efficiency_pct;
    // Incident score: heuristic, let's say 0 incidents is 100, 20 incidents is 0
    const safetyScore = Math.max(0, 100 - (incidentCount / 20) * 100);
    
    // Equal weighting
    const livabilityScore = Math.round((aqiScore + wasteScore + safetyScore) / 3);
    
    // Use Gemini for a one-line interpretation
    const prompt = `You are CityPulse. Provide a single short sentence interpreting these livability metrics for ward ${ward}: AQI=${env.aqi}, Waste Collection Efficiency=${env.waste_collection_efficiency_pct}%, Incident Rate=${incidentCount}. Composite score is ${livabilityScore}/100.`;
    const fallback = livabilityScore >= 80 
      ? "Excellent livability with strong safety and environmental metrics."
      : livabilityScore >= 60 
        ? "Moderate livability, but with areas for improvement in either air quality or safety."
        : "Poor livability metrics requiring immediate municipal intervention.";
    
    const interpretation = await generateOneLiner(prompt, fallback);

    results.push({
      ward,
      aqi: env.aqi,
      waste_efficiency: env.waste_collection_efficiency_pct,
      incident_rate: incidentCount,
      livability_score: livabilityScore,
      interpretation
    });
  }

  res.json(results);
});

export default router;
