import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { analyzeImage } from '../lib/gemini.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INCIDENTS_FILE = path.join(__dirname, '..', 'data', 'incidents.json');

// POST /api/citizen/report
router.post('/report', async (req, res) => {
  const { text, photoBase64, ward, lat, lng } = req.body;
  
  const fallbackObj = {
    type: "other",
    severity: "INFO",
    description: text || "Citizen report"
  };

  let classification = fallbackObj;

  if (photoBase64) {
    const prompt = `Classify the urban issue in this image and text: "${text || ''}". 
Respond in strict JSON: { 
  "type": "pothole" | "garbage" | "waterlogging" | "streetlight" | "other",
  "severity": "CRITICAL" | "HIGH" | "WARNING" | "INFO",
  "description": "Short summary of the issue"
}`;
    classification = await analyzeImage(photoBase64, prompt, fallbackObj);
  } else if (text) {
    // Basic fallback classification using text only if no photo
    const txt = text.toLowerCase();
    if (txt.includes('pothole')) classification.type = 'pothole';
    else if (txt.includes('garbage') || txt.includes('trash')) classification.type = 'garbage';
    else if (txt.includes('water') || txt.includes('flood')) classification.type = 'waterlogging';
    else if (txt.includes('light')) classification.type = 'streetlight';
  }

  const newIncident = {
    incident_id: `CIT-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
    type: classification.type,
    ward: ward || "Unknown",
    lat: lat || 12.9800,
    lng: lng || 77.6200,
    timestamp: new Date().toISOString(),
    severity: classification.severity,
    source: "citizen_report",
    notes: classification.description
  };

  try {
    const data = await fs.readFile(INCIDENTS_FILE, 'utf-8');
    const incidents = JSON.parse(data);
    incidents.push(newIncident);
    await fs.writeFile(INCIDENTS_FILE, JSON.stringify(incidents, null, 2));
  } catch (err) {
    console.error('Error saving citizen report to incidents.json:', err);
    return res.status(500).json({ error: 'Failed to save report' });
  }

  res.json(newIncident);
});

export default router;
