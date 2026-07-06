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

router.post('/draft', async (req, res) => {
  try {
    const { type, details } = req.body || {};
    
    const fallbackMemo = {
      title: `Auto-Drafted: ${type || 'Congestion Alert'}`,
      department: 'Traffic Management Center',
      justification: details || 'Automated alert triggered by anomaly detection system.',
      action_items: [
        'Review live camera feeds at the reported coordinates',
        'Deploy nearby field personnel to direct traffic manually',
        'Assess adjacent corridor signals to adjust throughput capacity'
      ]
    };

    const prompt = `You are an AI-powered city planning and dispatch coordinator for CityPulse.
An anomaly has been flagged in the city network:
Anomaly Type: ${type || 'Congestion / Incident Spike'}
Anomaly Details: ${details || 'High values detected above baseline.'}

Generate a professional, structured dispatch memo. Respond in strict JSON in this exact shape:
{
  "title": string (a professional, specific title for the memo under 10 words),
  "department": string (the suggested owning department, e.g. Traffic Police, Municipal Corporation, Road Authority, Health Dept, Emergency Services),
  "justification": string (1-2 sentences of professional justification referencing the specific details and why this action is required),
  "action_items": array of strings (exactly 3 specific, actionable tasks to address, resolve, or investigate the issue)
}`;

    const generated = await generateStructured(prompt, fallbackMemo);

    const newMemo = {
      id: `memo-${Date.now()}`,
      title: generated.title || fallbackMemo.title,
      department: generated.department || fallbackMemo.department,
      status: 'DRAFT',
      justification: generated.justification || fallbackMemo.justification,
      action_items: generated.action_items || fallbackMemo.action_items,
      created_at: new Date().toISOString(),
    };
    await addMemo(newMemo);
    res.json(newMemo);
  } catch (err) {
    console.error('Error drafting memo:', err);
    res.status(500).json({ error: 'Failed to draft memo' });
  }
});

export default router;
