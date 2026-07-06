import express from 'express';
import { generateOneLiner } from '../lib/gemini.js';

const router = express.Router();

const ENERGY_DATA = [
  { ward: 'MG Road', avg_kwh_per_month: 245000, solar_adoption_pct: 12, smart_meter_pct: 68, peak_demand_kw: 18200, green_pct: 18, timestamp: new Date().toISOString() },
  { ward: 'Indiranagar', avg_kwh_per_month: 198000, solar_adoption_pct: 24, smart_meter_pct: 82, peak_demand_kw: 14400, green_pct: 31, timestamp: new Date().toISOString() },
  { ward: 'Koramangala', avg_kwh_per_month: 212000, solar_adoption_pct: 18, smart_meter_pct: 75, peak_demand_kw: 16100, green_pct: 22, timestamp: new Date().toISOString() },
  { ward: 'Hebbal', avg_kwh_per_month: 156000, solar_adoption_pct: 8, smart_meter_pct: 45, peak_demand_kw: 12300, green_pct: 12, timestamp: new Date().toISOString() },
  { ward: 'Jayanagar', avg_kwh_per_month: 175000, solar_adoption_pct: 32, smart_meter_pct: 79, peak_demand_kw: 13100, green_pct: 38, timestamp: new Date().toISOString() },
];

const WATER_DATA = [
  { ward: 'MG Road', daily_consumption_kl: 4200, water_quality_index: 82, supply_hours: 6, loss_pct: 18, timestamp: new Date().toISOString() },
  { ward: 'Indiranagar', daily_consumption_kl: 3800, water_quality_index: 88, supply_hours: 8, loss_pct: 12, timestamp: new Date().toISOString() },
  { ward: 'Koramangala', daily_consumption_kl: 3950, water_quality_index: 85, supply_hours: 7, loss_pct: 14, timestamp: new Date().toISOString() },
  { ward: 'Hebbal', daily_consumption_kl: 3100, water_quality_index: 72, supply_hours: 5, loss_pct: 22, timestamp: new Date().toISOString() },
  { ward: 'Jayanagar', daily_consumption_kl: 3500, water_quality_index: 90, supply_hours: 9, loss_pct: 10, timestamp: new Date().toISOString() },
];

router.get('/energy', (req, res) => {
  const { ward } = req.query;
  let result = [...ENERGY_DATA];
  if (ward) result = result.filter(e => e.ward.toLowerCase().includes(ward.toLowerCase()));
  res.json(result);
});

router.get('/water', (req, res) => {
  const { ward } = req.query;
  let result = [...WATER_DATA];
  if (ward) result = result.filter(w => w.ward.toLowerCase().includes(ward.toLowerCase()));
  res.json(result);
});

router.get('/efficiency', async (req, res) => {
  const totalConsumption = ENERGY_DATA.reduce((s, e) => s + e.avg_kwh_per_month, 0);
  const avgSolarAdoption = ENERGY_DATA.reduce((s, e) => s + e.solar_adoption_pct, 0) / ENERGY_DATA.length;
  const avgGreenPct = ENERGY_DATA.reduce((s, e) => s + e.green_pct, 0) / ENERGY_DATA.length;
  const avgWaterLoss = WATER_DATA.reduce((s, w) => s + w.loss_pct, 0) / WATER_DATA.length;

  const topEfficientWards = ENERGY_DATA.map(e => {
    const water = WATER_DATA.find(w => w.ward === e.ward);
    return {
      ward: e.ward,
      efficiency_score: Math.round((e.solar_adoption_pct * 0.3 + e.green_pct * 0.3 + (water ? (100 - water.loss_pct) * 0.4 : 50))),
      solar_adoption: e.solar_adoption_pct,
      green_energy: e.green_pct,
      water_loss: water ? water.loss_pct : 'N/A',
    };
  }).sort((a, b) => b.efficiency_score - a.efficiency_score);

  const fallbackRationale = `Energy analysis across ${ENERGY_DATA.length} wards: avg solar adoption ${avgSolarAdoption.toFixed(0)}%, avg green energy ${avgGreenPct.toFixed(0)}%, avg water distribution loss ${avgWaterLoss.toFixed(0)}%.`;
  const prompt = `Given this utility data for Bengaluru: ${JSON.stringify({ totalConsumptionKWh: totalConsumption, avgSolarAdoptionPct: avgSolarAdoption.toFixed(0), avgGreenPct: avgGreenPct.toFixed(0), avgWaterLossPct: avgWaterLoss.toFixed(0), topEfficientWards: topEfficientWards.slice(0, 3) })}, provide a ONE-sentence assessment of energy and water utility efficiency across wards, highlighting the biggest opportunity for improvement.`;

  const interpretation = await generateOneLiner(prompt, fallbackRationale);

  res.json({
    total_monthly_consumption_kwh: totalConsumption,
    avg_solar_adoption_pct: Number(avgSolarAdoption.toFixed(0)),
    avg_green_energy_pct: Number(avgGreenPct.toFixed(0)),
    avg_water_loss_pct: Number(avgWaterLoss.toFixed(0)),
    ward_rankings: topEfficientWards,
    interpretation,
  });
});

export default router;