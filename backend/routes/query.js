import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateQueryResponse } from '../lib/gemini.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'traffic.json');

const getTrafficData = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (error) {
    return [];
  }
};

const getTrafficSummary = () => {
  const data = getTrafficData();
  const statsByRoute = {};

  data.forEach(record => {
    if (!statsByRoute[record.route_name]) {
      statsByRoute[record.route_name] = {
        route_name: record.route_name,
        total_congestion: 0,
        total_delay: 0,
        count: 0
      };
    }
    const stats = statsByRoute[record.route_name];
    stats.total_congestion += record.congestion;
    stats.total_delay += record.delay_minutes;
    stats.count += 1;
  });

  return Object.values(statsByRoute).map(stats => ({
    route_name: stats.route_name,
    avg_congestion: Math.round(stats.total_congestion / stats.count),
    avg_delay_minutes: Math.round(stats.total_delay / stats.count)
  }));
};

router.post('/', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  const allData = getTrafficData();
  const lowerQuestion = question.toLowerCase();

  // Basic keyword matching
  const keywords = ["mg road", "ring road", "airport expressway", "tech park avenue", "station road", "incident", "worst", "highest"];
  const matchedKeywords = keywords.filter(kw => lowerQuestion.includes(kw));

  let contextData = [];

  if (matchedKeywords.length > 0) {
    // Filter data if specific route is mentioned
    const mentionedRoutes = ["mg road", "ring road", "airport expressway", "tech park avenue", "station road"].filter(r => lowerQuestion.includes(r));
    
    if (mentionedRoutes.length > 0) {
      contextData = allData.filter(d => mentionedRoutes.includes(d.route_name.toLowerCase()));
      // If still too large, just take the last 48 hours for those routes
      contextData = contextData.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 100); 
    } else {
      // If "worst", "highest", "incident" without route, maybe sort and take top
      contextData = [...allData].sort((a, b) => b.congestion - a.congestion).slice(0, 50);
    }
  } else {
    // Fallback: pass summary data to keep context small
    contextData = getTrafficSummary();
  }

  try {
    let rawResponse = await generateQueryResponse(question, contextData);
    
    // Robust parsing: strip markdown code fences if present
    rawResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(rawResponse);
    res.json(parsed);
  } catch (error) {
    console.error("Query Error:", error);
    // Graceful fallback on API failure or parse failure
    res.json({
      answer: "Sorry, I couldn't process that question right now due to a service error.",
      chart_data: [],
      cited_points: []
    });
  }
});

export default router;
