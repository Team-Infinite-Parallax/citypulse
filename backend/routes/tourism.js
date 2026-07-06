import express from 'express';
import { generateQueryResponse, generateOneLiner } from '../lib/gemini.js';

const router = express.Router();

const POINTS_OF_INTEREST = [
  { id: 'poi-1', name: 'MG Road Shopping District', category: 'shopping', ward: 'MG Road', lat: 12.9716, lng: 77.5946, footfall_estimate: 8500, rating: 4.2 },
  { id: 'poi-2', name: 'Indiranagar 100ft Road', category: 'dining', ward: 'Indiranagar', lat: 12.9784, lng: 77.6408, footfall_estimate: 7200, rating: 4.5 },
  { id: 'poi-3', name: 'Koramangala Food Street', category: 'dining', ward: 'Koramangala', lat: 12.9352, lng: 77.6245, footfall_estimate: 6400, rating: 4.4 },
  { id: 'poi-4', name: 'Lalbagh Botanical Garden', category: 'park', ward: 'Jayanagar', lat: 12.9507, lng: 77.5848, footfall_estimate: 5200, rating: 4.6 },
  { id: 'poi-5', name: 'Hebbal Lake', category: 'park', ward: 'Hebbal', lat: 13.0358, lng: 77.5970, footfall_estimate: 3800, rating: 4.3 },
  { id: 'poi-6', name: 'Commercial Street', category: 'shopping', ward: 'MG Road', lat: 12.9823, lng: 77.6066, footfall_estimate: 9200, rating: 4.0 },
  { id: 'poi-7', name: 'Cubbon Park', category: 'park', ward: 'MG Road', lat: 12.9763, lng: 77.5929, footfall_estimate: 4800, rating: 4.7 },
  { id: 'poi-8', name: 'UB City Mall', category: 'shopping', ward: 'MG Road', lat: 12.9719, lng: 77.5965, footfall_estimate: 6800, rating: 4.3 },
];

const LOCAL_EVENTS = [
  { id: 'event-1', name: 'Weekend Food Festival', venue: 'Koramangala', date: '2026-07-11', expected_attendance: 3000, category: 'food' },
  { id: 'event-2', name: 'Artisan Market', venue: 'Indiranagar', date: '2026-07-12', expected_attendance: 1500, category: 'culture' },
  { id: 'event-3', name: 'Morning Yoga at Cubbon Park', venue: 'MG Road', date: '2026-07-13', expected_attendance: 500, category: 'wellness' },
  { id: 'event-4', name: 'Startup Networking Night', venue: 'Koramangala', date: '2026-07-14', expected_attendance: 800, category: 'business' },
];

router.get('/poi', (req, res) => {
  const { category, ward } = req.query;
  let result = [...POINTS_OF_INTEREST];
  if (category) result = result.filter(p => p.category === category);
  if (ward) result = result.filter(p => p.ward.toLowerCase().includes(ward.toLowerCase()));
  res.json(result);
});

router.get('/events', (req, res) => {
  res.json(LOCAL_EVENTS);
});

router.get('/impact', async (req, res) => {
  const totalFootfall = POINTS_OF_INTEREST.reduce((s, p) => s + p.footfall_estimate, 0);
  const avgRating = POINTS_OF_INTEREST.reduce((s, p) => s + p.rating, 0) / POINTS_OF_INTEREST.length;
  const topWards = [...new Set(POINTS_OF_INTEREST.map(p => p.ward))].map(ward => {
    const pois = POINTS_OF_INTEREST.filter(p => p.ward === ward);
    return {
      ward,
      poi_count: pois.length,
      total_footfall: pois.reduce((s, p) => s + p.footfall_estimate, 0),
      avg_rating: Number((pois.reduce((s, p) => s + p.rating, 0) / pois.length).toFixed(1)),
    };
  }).sort((a, b) => b.total_footfall - a.total_footfall);

  const fallbackRationale = `Tourism data shows ${POINTS_OF_INTEREST.length} tracked POIs generating ~${(totalFootfall / 1000).toFixed(0)}K daily footfall across ${topWards.length} wards. Top ward: ${topWards[0]?.ward}.`;
  const prompt = `Given this tourism data for Bengaluru: ${JSON.stringify({ totalFootfall, avgRating, topWards, upcomingEvents: LOCAL_EVENTS.length })}, provide a ONE-sentence economic impact assessment for local businesses and city planning. Focus on footfall patterns, event-driven traffic, and ward-level opportunity.`;

  const interpretation = await generateOneLiner(prompt, fallbackRationale);
  res.json({ total_footfall: totalFootfall, avg_rating: Number(avgRating.toFixed(1)), top_wards: topWards, upcoming_events: LOCAL_EVENTS.length, interpretation });
});

export default router;