import request from 'supertest';
import express from 'express';
import trafficRoutes from '../routes/traffic.js';
import forecastRoutes from '../routes/forecast.js';
import queryRoutes from '../routes/query.js';
import healthRoutes from '../routes/health.js';

const app = express();
app.use(express.json());
app.use('/api/traffic', trafficRoutes);
app.use('/api', forecastRoutes);
app.use('/api', healthRoutes);
app.use('/api/query', queryRoutes);

describe('CityPulse API', () => {
  it('GET /api/traffic should return traffic data', async () => {
    const res = await request(app).get('/api/traffic');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/alerts should return alerts', async () => {
    const res = await request(app).get('/api/alerts');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/forecast should return a seasonal-naive forecast per route', async () => {
    const res = await request(app).get('/api/forecast');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      const f = res.body[0];
      expect(f).toHaveProperty('predicted_congestion');
      expect(f).toHaveProperty('target_hour');
      expect(f.method).toMatch(/seasonal/i);
    }
  });

  it('GET /api/advisories should cross-reference AQI + congestion', async () => {
    const res = await request(app).get('/api/advisories');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      const a = res.body[0];
      expect(a).toHaveProperty('risk_level');
      expect(a).toHaveProperty('vulnerable_groups');
      expect(a).toHaveProperty('advisory');
    }
  });

  it('POST /api/query should process a question (with or without AI configured)', async () => {
    const res = await request(app).post('/api/query').send({ question: 'How is Ring Road traffic?' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.answer).toBeDefined();
    expect(Array.isArray(res.body.retrieval)).toBe(true);
  });

  it('POST /api/query should reject an empty question with 400', async () => {
    const res = await request(app).post('/api/query').send({ question: '' });
    expect(res.statusCode).toEqual(400);
  });
});
