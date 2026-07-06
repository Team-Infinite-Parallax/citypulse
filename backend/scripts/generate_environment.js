import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Synthetic Waste / Environment daily time-series per ward (~7 days). Fields:
// wardId, waste_collection_efficiency_pct, water_quality_index, aqi, timestamp.
// Ward-level AQI is included here so the composite Ward Livability Score is
// self-contained per ward. Labelled synthetic in RESPONSIBLE_AI.md.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const wards = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'wards.json'), 'utf-8'));

const DAYS = 7;
const today = new Date();
today.setHours(0, 0, 0, 0);

// Per-ward baseline "character" so wards differ believably (some cleaner, some
// more polluted). The spike ward (Aminabad) is deliberately the worst on waste.
const PROFILE = {
  Hazratganj: { waste: 88, water: 82, aqi: 70 },
  'Gomti Nagar': { waste: 92, water: 88, aqi: 60 },
  Alambagh: { waste: 74, water: 68, aqi: 110 },
  'Indira Nagar': { waste: 85, water: 80, aqi: 75 },
  Aminabad: { waste: 58, water: 60, aqi: 140 },
  Chowk: { waste: 70, water: 64, aqi: 120 },
};

const jitter = (base, spread) =>
  Math.round(base + (Math.random() - 0.5) * spread);

const rows = [];
for (let d = DAYS - 1; d >= 0; d--) {
  const day = new Date(today);
  day.setDate(today.getDate() - d);
  for (const w of wards) {
    const p = PROFILE[w.ward] || { waste: 80, water: 75, aqi: 90 };
    rows.push({
      wardId: w.ward,
      waste_collection_efficiency_pct: Math.max(0, Math.min(100, jitter(p.waste, 8))),
      water_quality_index: Math.max(0, Math.min(100, jitter(p.water, 8))),
      aqi: Math.max(20, Math.min(300, jitter(p.aqi, 18))),
      timestamp: day.toISOString(),
    });
  }
}

fs.writeFileSync(path.join(DATA_DIR, 'environment.json'), JSON.stringify(rows, null, 2));
console.log(`Generated ${rows.length} ward-day environment records in data/environment.json`);
