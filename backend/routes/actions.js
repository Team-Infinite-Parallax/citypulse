import express from 'express';

const router = express.Router();

const memos = [
  {
    id: 'memo-1',
    title: 'Deploy traffic personnel to MG Road',
    department: 'Bengaluru Traffic Police',
    status: 'DRAFT',
    justification: 'Sustained high congestion (>80) during peak hours on MG Road over the last 3 days. Manual traffic direction may help reduce bottlenecks.',
    action_items: ['Deploy 2 officers at Minsk Square', 'Coordinate with BMTC for bus lane enforcement', 'Set up temporary diversions if congestion exceeds 90'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'memo-2',
    title: 'Signal timing review — Hebbal Junction',
    department: 'Road Infrastructure Authority',
    status: 'DISPATCHED',
    justification: 'Signal failure reported at Hebbal junction during morning peak. Emergency timing pattern recommended.',
    action_items: ['Review signal timing sequence', 'Deploy maintenance crew for inspection'],
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

router.get('/memos', (req, res) => {
  res.json(memos);
});

router.post('/dispatch/:id', (req, res) => {
  const memo = memos.find(m => m.id === req.params.id);
  if (memo) {
    memo.status = 'DISPATCHED';
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Memo not found' });
  }
});

router.post('/draft', (req, res) => {
  const newMemo = {
    id: `memo-${Date.now()}`,
    title: 'Auto-Drafted: Congestion Alert',
    department: 'Traffic Management Center',
    status: 'DRAFT',
    justification: req.body?.details || 'Automated alert triggered by anomaly detection system.',
    action_items: ['Review live camera feed', 'Adjust signal timing if needed', 'Alert ground personnel'],
    created_at: new Date().toISOString(),
  };
  memos.unshift(newMemo);
  res.json(newMemo);
});

export default router;
