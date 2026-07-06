import express from 'express';
import { getMemos, saveMemo } from '../lib/memoStore.js';
import { generateStructured } from '../lib/gemini.js';
import crypto from 'crypto';

const router = express.Router();

// GET /api/actions/memos
router.get('/memos', async (req, res) => {
  const memos = await getMemos();
  res.json(memos);
});

// POST /api/actions/draft
router.post('/draft', async (req, res) => {
  const anomaly = req.body; // Expects anomaly data
  
  const fallbackMemo = {
    title: "Review Congestion Anomaly",
    department: "Traffic Operations",
    action_items: ["Review live cameras", "Consider temporary signal adjustment"],
    justification: "Anomaly detected in traffic data."
  };

  const prompt = `You are a city traffic and public safety planner. Draft a short, actionable response memo for this anomaly:
${JSON.stringify(anomaly)}
Respond in strict JSON: { "title": string, "department": string, "action_items": string[], "justification": string }`;
  
  const draft = await generateStructured(prompt, fallbackMemo);
  
  const memo = {
    id: `memo-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    ...draft,
    status: 'DRAFT',
    created_at: new Date().toISOString(),
    anomaly_ref: anomaly
  };

  await saveMemo(memo);
  res.json(memo);
});

// POST /api/actions/dispatch/:id
router.post('/dispatch/:id', async (req, res) => {
  const memos = await getMemos();
  const memo = memos.find(m => m.id === req.params.id);
  if (!memo) {
    return res.status(404).json({ error: 'Memo not found' });
  }

  memo.status = 'DISPATCHED';
  memo.dispatched_at = new Date().toISOString();
  await saveMemo(memo);
  
  res.json(memo);
});

export default router;
