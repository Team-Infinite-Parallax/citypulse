import request from 'supertest';
import express from 'express';
import trafficRoutes from '../routes/traffic.js';
import forecastRoutes from '../routes/forecast.js';
import queryRoutes from '../routes/query.js';

const app = express();
app.use(express.json());
app.use('/api/traffic', trafficRoutes);
app.use('/api', forecastRoutes);
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
  
  it('POST /api/query should process a question (with or without AI configured)', async () => {
    const res = await request(app).post('/api/query').send({ question: "How is test road?" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.answer).toBeDefined();
  });
});
