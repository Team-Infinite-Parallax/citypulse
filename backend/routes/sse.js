import express from 'express';

const router = express.Router();

// Active SSE connections
const clients = new Set();

// Broadcast an event to all connected clients
export const broadcast = (event, data) => {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    client.write(message);
  }
};

// GET /api/events — Server-Sent Events stream for real-time updates
router.get('/', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Send initial connection event
  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  clients.add(res);

  // Heartbeat every 30 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(`event: heartbeat\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);
  }, 30000);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(res);
  });
});

// GET /api/events/stats — connection stats
router.get('/stats', (req, res) => {
  res.json({ active_connections: clients.size });
});

export default router;
