import fs from 'fs';
import path from 'path';

const routes = ["MG Road", "Ring Road", "Airport Expressway", "Tech Park Avenue", "Station Road"];
const DAYS = 7;
const HOURS_PER_DAY = 24;

const data = [];
const today = new Date();
today.setMinutes(0, 0, 0); // round to hour

for (let d = DAYS - 1; d >= 0; d--) {
  for (let h = 0; h < HOURS_PER_DAY; h++) {
    const recordTime = new Date(today);
    recordTime.setDate(today.getDate() - d);
    recordTime.setHours(h);

    routes.forEach(route => {
      let congestion = Math.floor(Math.random() * 40) + 10; // base congestion 10-50
      let delay_minutes = Math.floor(congestion / 5);
      let notes = "";

      // Peak hour bumps
      const isMorningPeak = h >= 8 && h <= 10;
      const isEveningPeak = h >= 17 && h <= 20;
      if (isMorningPeak || isEveningPeak) {
        congestion += Math.floor(Math.random() * 30) + 20; // bump to 50-90
        delay_minutes += Math.floor(Math.random() * 15) + 5;
      }

      // Seed explicit anomaly: Ring Road, 5 days ago (d=5), 09:00 AM
      if (route === "Ring Road" && d === 5 && h === 9) {
        congestion = 98;
        delay_minutes = 45;
        notes = "Major incident reported";
      }

      // Keep within 0-100
      congestion = Math.min(100, congestion);

      // Air Quality Index (second domain). Correlated with congestion, since
      // idling traffic drives tailpipe emissions, plus mild noise. Clamped 30-150.
      let aqi = Math.round(30 + congestion * 0.9 + (Math.random() * 20 - 10));
      // Ring Road incident also spikes air quality to an unhealthy level.
      if (route === "Ring Road" && d === 5 && h === 9) aqi = 150;
      aqi = Math.max(30, Math.min(150, aqi));

      data.push({
        route_name: route,
        timestamp: recordTime.toISOString(),
        congestion,
        delay_minutes,
        notes,
        aqi
      });
    });
  }
}

const dir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

fs.writeFileSync(path.join(dir, 'traffic.json'), JSON.stringify(data, null, 2));

console.log(`Generated ${data.length} records in data/traffic.json`);
console.log('Seeded Anomaly: Route "Ring Road", 5 days ago, 09:00 AM, congestion: 98, notes: "Major incident reported"');
