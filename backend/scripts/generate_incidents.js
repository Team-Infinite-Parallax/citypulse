import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Synthetic Public-Safety incident stream for the demo city, one record per
// incident across ~7 days and 6 wards. Labelled synthetic in RESPONSIBLE_AI.md.
// Coordinates are jittered around each ward centroid (see data/wards.json) so
// markers render on the same MapLibre view as the traffic corridors.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const wards = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'wards.json'), 'utf-8'));

const TYPES = ['accident', 'theft', 'assault', 'fire', 'vandalism', 'traffic_hazard'];
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
// Weighted severity: mostly low/medium.
const pickSeverity = () => {
  const r = Math.random();
  if (r < 0.45) return 'LOW';
  if (r < 0.8) return 'MEDIUM';
  if (r < 0.95) return 'HIGH';
  return 'CRITICAL';
};

const DAYS = 7;
const today = new Date();
today.setMinutes(0, 0, 0);

// Ward that gets a deliberate incident-rate spike on the most recent day, so
// the shared detectRateSpikes() flags a real hotspot in the demo.
const SPIKE_WARD = 'Aminabad';

const incidents = [];
let id = 1;

for (let d = DAYS - 1; d >= 0; d--) {
  const day = new Date(today);
  day.setDate(today.getDate() - d);

  for (const w of wards) {
    // Baseline: 4-9 incidents/ward/day.
    let count = 4 + Math.floor(Math.random() * 6);
    // Spike: the most recent day (d === 0) on one ward jumps to 22-28.
    if (w.ward === SPIKE_WARD && d === 0) count = 22 + Math.floor(Math.random() * 7);

    for (let i = 0; i < count; i++) {
      const t = new Date(day);
      t.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
      const severity = w.ward === SPIKE_WARD && d === 0 && i % 3 === 0 ? 'HIGH' : pickSeverity();
      incidents.push({
        incident_id: `INC-${String(id++).padStart(4, '0')}`,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        ward: w.ward,
        lat: Number((w.lat + (Math.random() - 0.5) * 0.012).toFixed(5)),
        lng: Number((w.lng + (Math.random() - 0.5) * 0.012).toFixed(5)),
        timestamp: t.toISOString(),
        severity,
        source: 'sensor',
      });
    }
  }
}

incidents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

fs.writeFileSync(path.join(DATA_DIR, 'incidents.json'), JSON.stringify(incidents, null, 2));
console.log(`Generated ${incidents.length} incidents in data/incidents.json`);
console.log(`Seeded incident-rate spike: ward "${SPIKE_WARD}" on the most recent day.`);
