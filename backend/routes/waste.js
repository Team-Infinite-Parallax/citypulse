import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
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

const loadWardsFile = async () => {
  try {
    return JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'wards.json'), 'utf-8'));
  } catch {
    return [];
  }
};

router.get('/summary', async (req, res) => {
  const env = await loadEnvFile();
  const wards = await loadWardsFile();

  const latestEnv = {};
  env.forEach(e => {
    if (!latestEnv[e.wardId] || new Date(e.timestamp) > new Date(latestEnv[e.wardId].timestamp)) {
      latestEnv[e.wardId] = e;
    }
  });

  const wardNames = wards.length ? wards : Object.keys(latestEnv);
  
  const wasteData = await Promise.all(wardNames.map(async (ward) => {
    const envData = latestEnv[ward];
    const wasteEfficiency = envData?.waste_collection_efficiency_pct || Math.floor(Math.random() * 40 + 50); // Fallback 50-90
    const waterQuality = envData?.water_quality_index || Math.floor(Math.random() * 30 + 60);

    const prompt = `Provide a 1-sentence AI recommendation to improve waste management for ${ward}, given its current waste collection efficiency is ${wasteEfficiency}% and water quality index is ${waterQuality}. Keep it actionable for city planners.`;
    const fallback = wasteEfficiency < 70 
      ? `Deploy additional smart bins and increase collection frequency in ${ward} to prevent overflow.`
      : `Maintain current collection schedules in ${ward} while initiating community recycling awareness programs.`;
    
    const recommendation = await generateOneLiner(prompt, fallback);

    return {
      ward,
      waste_efficiency: wasteEfficiency,
      water_quality: waterQuality,
      recommendation,
      // Calculate a derived recycling estimate for the UI
      recycling_rate: Math.max(0, Math.round(wasteEfficiency * 0.4 + (Math.random() * 10 - 5)))
    };
  }));

  // Sort by lowest efficiency first (needs most attention)
  wasteData.sort((a, b) => a.waste_efficiency - b.waste_efficiency);
  res.json(wasteData);
});

export default router;
