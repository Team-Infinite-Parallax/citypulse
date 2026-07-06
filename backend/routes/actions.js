import express from 'express';
import { getMemos, addMemo, updateMemoStatus } from '../lib/firestore.js';

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
    const newMemo = {
      id: `memo-${Date.now()}`,
      title: 'Auto-Drafted: Congestion Alert',
      department: 'Traffic Management Center',
      status: 'DRAFT',
      justification: req.body?.details || 'Automated alert triggered by anomaly detection system.',
      action_items: ['Review live camera feed', 'Adjust signal timing if needed', 'Alert ground personnel'],
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
