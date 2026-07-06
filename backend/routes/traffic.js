import express from 'express';
import { getTrafficData } from '../lib/db.js';

const router = express.Router();

// GET /api/traffic
// Serves all time-series data
router.get('/', async (req, res) => {
  const data = await getTrafficData();
  res.json(data);
});

// GET /api/traffic/summary
// Returns avg_congestion, avg_delay_minutes, and peak_hour per route
router.get('/summary', async (req, res) => {
  const data = await getTrafficData();
  
  const statsByRoute = {};

  data.forEach(record => {
    if (!statsByRoute[record.route_name]) {
      statsByRoute[record.route_name] = {
        route_name: record.route_name,
        total_congestion: 0,
        total_delay: 0,
        count: 0,
        hourly_congestion: Array(24).fill().map(() => ({ total: 0, count: 0 }))
      };
    }
    
    const stats = statsByRoute[record.route_name];
    stats.total_congestion += record.congestion;
    stats.total_delay += record.delay_minutes;
    stats.count += 1;
    
    const hour = new Date(record.timestamp).getHours();
    stats.hourly_congestion[hour].total += record.congestion;
    stats.hourly_congestion[hour].count += 1;
  });

  const summary = Object.values(statsByRoute).map(stats => {
    const avg_congestion = Math.round(stats.total_congestion / stats.count);
    const avg_delay_minutes = Math.round(stats.total_delay / stats.count);
    
    let peak_hour = 0;
    let max_avg_hourly_congestion = 0;
    
    stats.hourly_congestion.forEach((hr, index) => {
      if (hr.count > 0) {
        const hr_avg = hr.total / hr.count;
        if (hr_avg > max_avg_hourly_congestion) {
          max_avg_hourly_congestion = hr_avg;
          peak_hour = index;
        }
      }
    });

    // Format peak hour nicely, e.g., "09:00" or "9:00 AM"
    const peak_hour_str = `${peak_hour.toString().padStart(2, '0')}:00`;

    return {
      route_name: stats.route_name,
      avg_congestion,
      avg_delay_minutes,
      peak_hour: peak_hour_str
    };
  });

  res.json(summary);
});

export default router;
