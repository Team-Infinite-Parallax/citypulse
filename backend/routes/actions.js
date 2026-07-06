import express from 'express';
import { getMemos, addMemo, updateMemoStatus } from '../lib/firestore.js';
import { generateStructured } from '../lib/gemini.js';

const router = express.Router();

router.get('/memos', async (req, res) => {
  try {
    const list = await getMemos();
    res.json(list);
  } catch (err) {
    console.error('Error getting memos:', err);
    res.status(500).json({ error: 'Failed to get memos' });
  }
});

router.post('/dispatch/:id', async (req, res) => {
  try {
    const success = await updateMemoStatus(req.params.id, 'DISPATCHED');
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Memo not found' });
    }
  } catch (err) {
    console.error('Error dispatching memo:', err);
    res.status(500).json({ error: 'Failed to dispatch memo' });
  }
});

// POST /api/actions/draft — AI-powered memo generation from anomaly context
// Accepts anomaly data and calls Gemini to draft a structured action memo
// with situation-specific title, justification, action items, and department.
router.post('/draft', async (req, res) => {
  try {
    const {
      ward,
      route_name,
      metric,
      value,
      severity,
      zscore,
      baseline,
      domain,
      description,
      details, // legacy alias for description (older UI + tests send this)
      timestamp,
    } = req.body || {};

    const entity = ward || route_name || 'Unknown';
    const domainLabel = domain || 'general';
    const severityLabel = severity || 'WARNING';
    const metricLabel = metric || 'congestion';
    const metricValue = value || 'elevated';
    const zscoreLabel = zscore ? `${zscore}σ above baseline` : 'above threshold';
    const baselineLabel = baseline || 'n/a';
    const desc = description || details || `Anomaly detected for ${entity}: ${metricLabel} at ${metricValue}.`;

    // Department routing based on domain
    const departmentMap = {
      mobility: 'Traffic Management Center',
      traffic: 'Traffic Management Center',
      public_safety: 'Public Safety Department',
      safety: 'Public Safety Department',
      environment: 'Environmental Services',
      waste: 'Municipal Waste Management',
      health: 'Public Health Department',
      energy: 'Utility Services',
      water: 'Water Supply Authority',
      tourism: 'Tourism & Culture Department',
      education: 'Education Department',
      community: 'Community Services',
    };
    const fallbackDept = departmentMap[domainLabel] || 'City Operations Center';

    const prompt = `You are the CityPulse Decision Intelligence system. An anomaly has been detected that requires an action memo for city officials.

ANOMALY CONTEXT:
- Entity: ${entity}
- Domain: ${domainLabel}
- Metric: ${metricLabel} = ${metricValue}
- Severity: ${severityLabel}
- Statistical deviation: ${zscoreLabel} (baseline: ${baselineLabel})
- Description: ${desc}
- Timestamp: ${timestamp || new Date().toISOString()}

Generate a structured action memo as JSON:
{
  "title": "A concise, specific title describing the situation and required action (e.g., 'Deploy Traffic Personnel to MG Road — Sustained Congestion Spike')",
  "department": "The most appropriate department to handle this (e.g., '${fallbackDept}')",
  "justification": "A 2-3 sentence explanation of WHY this action is needed, referencing the specific data (metric values, severity, affected area). Be specific, not generic.",
  "action_items": ["Array of 3-5 specific, actionable steps the department should take. Each item should be concrete and time-bound where possible."],
  "urgency": "${severityLabel === 'CRITICAL' ? 'IMMEDIATE' : severityLabel === 'HIGH' ? 'URGENT' : 'STANDARD'}",
  "affected_area": "${entity}",
  "domain": "${domainLabel}"
}`;

    const fallbackMemo = {
      title: `${severityLabel} Alert: ${metricLabel} anomaly in ${entity}`,
      department: fallbackDept,
      justification: `${desc} This reading of ${metricValue} is ${zscoreLabel} and classified as ${severityLabel}. Immediate assessment and corrective action are recommended.`,
      action_items: [
        `Assess current ${metricLabel} conditions at ${entity}`,
        `Deploy field team if situation persists beyond 2 hours`,
        `Coordinate with adjacent departments for cross-domain impact`,
        `File incident report and update monitoring threshold if needed`,
      ],
      urgency: severityLabel === 'CRITICAL' ? 'IMMEDIATE' : severityLabel === 'HIGH' ? 'URGENT' : 'STANDARD',
      affected_area: entity,
      domain: domainLabel,
    };

    const aiMemo = await generateStructured(prompt, fallbackMemo);

    const newMemo = {
      id: `memo-${Date.now()}`,
      title: aiMemo.title || fallbackMemo.title,
      department: aiMemo.department || fallbackMemo.department,
      status: 'DRAFT',
      justification: aiMemo.justification || fallbackMemo.justification,
      action_items: Array.isArray(aiMemo.action_items) ? aiMemo.action_items : fallbackMemo.action_items,
      urgency: aiMemo.urgency || fallbackMemo.urgency,
      affected_area: aiMemo.affected_area || entity,
      domain: aiMemo.domain || domainLabel,
      anomaly_source: {
        entity,
        metric: metricLabel,
        value: metricValue,
        severity: severityLabel,
        zscore: zscore || null,
        baseline: baselineLabel,
        timestamp: timestamp || new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
      ai_generated: true,
    };

    await addMemo(newMemo);
    res.json(newMemo);
  } catch (err) {
    console.error('Error drafting memo:', err);
    res.status(500).json({ error: 'Failed to draft memo' });
  }
});

export default router;
