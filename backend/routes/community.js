import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateStructured, generateOneLiner } from '../lib/gemini.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadCommunityData = async () => {
  try {
    return JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'community.json'), 'utf-8'));
  } catch { return []; }
};

const loadIncidents = async () => {
  try {
    return JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'incidents.json'), 'utf-8'));
  } catch { return []; }
};

const loadEnvData = async () => {
  try {
    return JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'environment.json'), 'utf-8'));
  } catch { return []; }
};

// GET /api/community/programs — volunteer programs + social services
router.get('/programs', async (req, res) => {
  const { ward, category, type } = req.query;
  let data = await loadCommunityData();
  if (ward) data = data.filter(d => d.ward.toLowerCase().includes(ward.toLowerCase()));
  if (category) data = data.filter(d => d.category === category);
  if (type) data = data.filter(d => (d.type || 'volunteer') === type);
  res.json({
    volunteer_programs: data.filter(d => !d.type || d.type !== 'social_service'),
    social_services: data.filter(d => d.type === 'social_service'),
  });
});

// GET /api/community/vulnerability — AI-generated Social Vulnerability Index per ward
// Cross-references incidents, environment, healthcare access, and service availability
router.get('/vulnerability', async (req, res) => {
  const [community, incidents, envData] = await Promise.all([
    loadCommunityData(),
    loadIncidents(),
    loadEnvData(),
  ]);

  // Aggregate per ward
  const wardMapping = { 'Hazratganj': 'MG Road', 'Gomti Nagar': 'Indiranagar', 'Alambagh': 'Koramangala', 'Indira Nagar': 'Hebbal', 'Aminabad': 'Koramangala', 'Chowk': 'MG Road' };
  const wardData = {};
  const wards = ['MG Road', 'Indiranagar', 'Koramangala', 'Hebbal', 'Jayanagar'];
  wards.forEach(w => { wardData[w] = { ward: w, incident_count: 0, services: 0, volunteers_active: 0, aqi: 50, waste_efficiency: 50 }; });

  incidents.forEach(inc => {
    const w = wardMapping[inc.ward] || inc.ward;
    if (wardData[w]) wardData[w].incident_count += 1;
  });

  envData.forEach(e => {
    if (wardData[e.wardId]) {
      wardData[e.wardId].aqi = e.aqi || 50;
      wardData[e.wardId].waste_efficiency = e.waste_collection_efficiency_pct || 50;
    }
  });

  community.forEach(c => {
    if (wardData[c.ward]) {
      if (c.type === 'social_service') wardData[c.ward].services += 1;
      else wardData[c.ward].volunteers_active += (c.volunteers_registered || 0);
    }
  });

  // Compute Social Vulnerability Index (SVI) — higher = more vulnerable
  const wardScores = Object.values(wardData).map(w => {
    const incidentScore = Math.min(100, w.incident_count * 3); // higher incidents = more vulnerable
    const aqiScore = Math.min(100, w.aqi); // higher AQI = more vulnerable
    const wasteScore = Math.max(0, 100 - w.waste_efficiency); // lower efficiency = more vulnerable
    const serviceScore = Math.max(0, 100 - w.services * 20); // fewer services = more vulnerable
    const volunteerScore = Math.max(0, 100 - w.volunteers_active * 2); // fewer volunteers = more vulnerable

    const svi = Math.round((incidentScore * 0.25 + aqiScore * 0.2 + wasteScore * 0.15 + serviceScore * 0.2 + volunteerScore * 0.2));
    const resilience = Math.max(0, 100 - svi);

    return {
      ward: w.ward,
      svi,
      resilience_score: resilience,
      components: {
        safety: { score: incidentScore, incidents: w.incident_count },
        environment: { score: aqiScore, aqi: w.aqi },
        services: { score: serviceScore, count: w.services },
        waste: { score: wasteScore, efficiency: w.waste_efficiency },
        volunteers: { score: volunteerScore, active: w.volunteers_active },
      },
    };
  }).sort((a, b) => b.svi - a.svi);

  const mostVulnerable = wardScores[0];
  const prompt = `As the CityPulse community analyst, interpret this Social Vulnerability Index data. The most vulnerable ward is ${mostVulnerable.ward} (SVI: ${mostVulnerable.svi}/100). Provide ONE sentence summarizing the key factors driving vulnerability across the city and the most impactful intervention. Data: ${JSON.stringify(wardScores.slice(0, 3))}`;
  const fallback = `${mostVulnerable.ward} is the most socially vulnerable ward (SVI: ${mostVulnerable.svi}/100) driven by ${mostVulnerable.components.safety.incidents} incidents and limited service coverage. Expanding volunteer programs and social services in this area would have the highest community impact.`;

  const interpretation = await generateOneLiner(prompt, fallback);

  res.json({
    wards: wardScores,
    interpretation,
    methodology: 'Composite index: safety incidents (25%), AQI (20%), service availability (20%), volunteer coverage (20%), waste management (15%)',
  });
});

// GET /api/community/impact — overall community impact summary
router.get('/impact', async (req, res) => {
  const community = await loadCommunityData();
  const volunteers = community.filter(c => !c.type || c.type !== 'social_service');
  const services = community.filter(c => c.type === 'social_service');

  const totalVolunteers = volunteers.reduce((s, v) => s + (v.volunteers_registered || 0), 0);
  const totalNeeded = volunteers.reduce((s, v) => s + (v.volunteers_needed || 0), 0);
  const categories = [...new Set(community.map(c => c.category))];

  const impactMetrics = volunteers.map(v => v.impact_metric).filter(Boolean);

  const prompt = `Summarize the community impact of ${volunteers.length} volunteer programs and ${services.length} social services across Bengaluru, with ${totalVolunteers} active volunteers. Key impact metrics: ${impactMetrics.join('; ')}. ONE sentence only.`;
  const fallback = `${volunteers.length} active volunteer programs with ${totalVolunteers}/${totalNeeded} volunteers and ${services.length} social services are serving communities across ${categories.length} impact categories.`;
  const interpretation = await generateOneLiner(prompt, fallback);

  res.json({
    volunteer_programs: volunteers.length,
    social_services: services.length,
    total_volunteers_active: totalVolunteers,
    total_volunteers_needed: totalNeeded,
    volunteer_fill_rate_pct: Math.round((totalVolunteers / totalNeeded) * 100),
    categories,
    impact_highlights: impactMetrics,
    interpretation,
  });
});

export default router;
