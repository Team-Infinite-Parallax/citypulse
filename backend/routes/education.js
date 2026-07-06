import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateStructured, generateOneLiner } from '../lib/gemini.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadEducationData = async () => {
  try {
    return JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'education.json'), 'utf-8'));
  } catch { return []; }
};

// GET /api/education/programs — list all learning programs with optional filters
router.get('/programs', async (req, res) => {
  const { ward, category } = req.query;
  let programs = await loadEducationData();
  if (ward) programs = programs.filter(p => p.ward.toLowerCase().includes(ward.toLowerCase()));
  if (category) programs = programs.filter(p => p.category === category);
  programs.sort((a, b) => b.impact_score - a.impact_score);
  res.json(programs);
});

// GET /api/education/stats — ward-level education metrics
router.get('/stats', async (req, res) => {
  const programs = await loadEducationData();
  const wardStats = {};
  programs.forEach(p => {
    if (!wardStats[p.ward]) wardStats[p.ward] = { ward: p.ward, total_programs: 0, total_enrolled: 0, total_capacity: 0, categories: new Set(), avg_rating: 0, avg_impact: 0 };
    const w = wardStats[p.ward];
    w.total_programs += 1;
    w.total_enrolled += p.enrolled;
    w.total_capacity += p.capacity;
    w.categories.add(p.category);
    w.avg_rating += p.rating;
    w.avg_impact += p.impact_score;
  });

  const stats = Object.values(wardStats).map(w => ({
    ward: w.ward,
    total_programs: w.total_programs,
    total_enrolled: w.total_enrolled,
    total_capacity: w.total_capacity,
    utilization_pct: Math.round((w.total_enrolled / w.total_capacity) * 100),
    categories: [...w.categories],
    avg_rating: Number((w.avg_rating / w.total_programs).toFixed(1)),
    avg_impact: Math.round(w.avg_impact / w.total_programs),
  })).sort((a, b) => b.avg_impact - a.avg_impact);

  const totalEnrolled = stats.reduce((s, w) => s + w.total_enrolled, 0);
  const totalCapacity = stats.reduce((s, w) => s + w.total_capacity, 0);
  const overallUtilization = Math.round((totalEnrolled / totalCapacity) * 100);

  res.json({
    wards: stats,
    summary: {
      total_programs: programs.length,
      total_enrolled: totalEnrolled,
      total_capacity: totalCapacity,
      overall_utilization_pct: overallUtilization,
      categories: [...new Set(programs.map(p => p.category))],
    },
  });
});

// GET /api/education/recommendations — AI-generated learning recommendations per ward
router.get('/recommendations', async (req, res) => {
  const programs = await loadEducationData();

  // Load incident and environment data for cross-domain recommendations
  let incidents = [], envData = [];
  try {
    incidents = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'incidents.json'), 'utf-8'));
    envData = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'environment.json'), 'utf-8'));
  } catch {}

  const wardIncidents = {};
  incidents.forEach(inc => {
    const mapping = { 'Hazratganj': 'MG Road', 'Gomti Nagar': 'Indiranagar', 'Alambagh': 'Koramangala', 'Indira Nagar': 'Hebbal', 'Aminabad': 'Koramangala', 'Chowk': 'MG Road' };
    const ward = mapping[inc.ward] || inc.ward;
    wardIncidents[ward] = (wardIncidents[ward] || 0) + 1;
  });

  const wardPrograms = {};
  programs.forEach(p => {
    if (!wardPrograms[p.ward]) wardPrograms[p.ward] = [];
    wardPrograms[p.ward].push(p);
  });

  const wards = [...new Set([...Object.keys(wardPrograms), ...Object.keys(wardIncidents)])];

  const prompt = `As the CityPulse education planner, analyze this data and recommend 3 high-priority learning programs that should be added or expanded across wards. Consider: incident rates (wards with more incidents need safety/first-aid training), environment scores (wards with poor AQI need green-skills), existing program gaps, and enrollment patterns.

Ward data: ${JSON.stringify(wards.map(w => ({
    ward: w,
    incidents: wardIncidents[w] || 0,
    existing_programs: (wardPrograms[w] || []).length,
    categories_covered: [...new Set((wardPrograms[w] || []).map(p => p.category))],
    avg_utilization: wardPrograms[w] ? Math.round(wardPrograms[w].reduce((s, p) => s + p.enrolled, 0) / wardPrograms[w].reduce((s, p) => s + p.capacity, 0) * 100) : 0,
  })))}

Respond as JSON: {
  "recommendations": [{ "ward": string, "program_title": string, "category": string, "reason": string, "priority": "HIGH" | "MEDIUM" | "LOW", "target_audience": string }],
  "summary": "one-sentence summary of overall education landscape and key gaps"
}`;

  const fallback = {
    recommendations: [
      { ward: 'Hebbal', program_title: 'Disaster Preparedness Community Workshop', category: 'safety', reason: 'Hebbal has high incident rates and limited safety training programs', priority: 'HIGH', target_audience: 'All residents' },
      { ward: 'MG Road', program_title: 'Clean Air Awareness Campaign', category: 'environment', reason: 'High-congestion area with elevated AQI needs community-level awareness', priority: 'MEDIUM', target_audience: 'General public' },
      { ward: 'Jayanagar', program_title: 'Digital Skills for Senior Citizens', category: 'digital_skills', reason: 'Ward has wellness programs for seniors but no digital literacy options', priority: 'MEDIUM', target_audience: 'Seniors (60+)' },
    ],
    summary: `${programs.length} active programs across ${wards.length} wards with ${Math.round(programs.reduce((s, p) => s + p.enrolled, 0) / programs.reduce((s, p) => s + p.capacity, 0) * 100)}% overall utilization. Key gaps: safety training in high-incident wards, digital skills in underserved areas.`,
  };

  const result = await generateStructured(prompt, fallback);
  res.json(result);
});

export default router;
