import request from 'supertest';
import express from 'express';
import publicSafetyRoutes from '../routes/publicSafety.js';
import actionsRoutes from '../routes/actions.js';
import citizenRoutes from '../routes/citizen.js';

const app = express();
app.use(express.json());
app.use('/api/public-safety', publicSafetyRoutes);
app.use('/api/actions', actionsRoutes);
app.use('/api/citizen', citizenRoutes);

describe('CityPulse Firestore Integration (Fallback Mode)', () => {
  it('POST /api/citizen/report persists report and GET /api/public-safety/incidents retrieves it', async () => {
    // 1. Post a new citizen report
    const uniqueWard = `TestWard-${Date.now()}`;
    const reportData = {
      text: "Large pothole in the middle lane",
      ward: uniqueWard,
      lat: 12.9716,
      lng: 77.5946
    };

    const postRes = await request(app)
      .post('/api/citizen/report')
      .send(reportData);

    expect(postRes.statusCode).toEqual(200);
    expect(postRes.body).toHaveProperty('incident_id');
    expect(postRes.body.ward).toEqual(uniqueWard);
    expect(postRes.body.type).toEqual('pothole');
    expect(postRes.body.source).toEqual('citizen_report');

    // 2. Get list of incidents and find our newly created one
    const getRes = await request(app)
      .get('/api/public-safety/incidents');

    expect(getRes.statusCode).toEqual(200);
    expect(Array.isArray(getRes.body)).toBe(true);
    const found = getRes.body.find(inc => inc.ward === uniqueWard);
    expect(found).toBeDefined();
    expect(found.notes).toEqual('Large pothole in the middle lane');
  });

  it('POST /api/actions/draft then GET /api/actions/memos returns the drafted memo', async () => {
    const detailsText = `Test details for draft memo ${Date.now()}`;
    
    // 1. Post draft memo
    const postRes = await request(app)
      .post('/api/actions/draft')
      .send({ details: detailsText });

    expect(postRes.statusCode).toEqual(200);
    expect(postRes.body).toHaveProperty('id');
    expect(postRes.body.status).toEqual('DRAFT');
    // The endpoint drafts a memo AROUND the provided details, so the input
    // must be incorporated into the justification, not echoed verbatim.
    expect(postRes.body.justification).toEqual(expect.stringContaining(detailsText));

    const memoId = postRes.body.id;

    // 2. Get list of memos and verify it's there
    const getRes = await request(app)
      .get('/api/actions/memos');

    expect(getRes.statusCode).toEqual(200);
    expect(Array.isArray(getRes.body)).toBe(true);
    const found = getRes.body.find(m => m.id === memoId);
    expect(found).toBeDefined();
    expect(found.justification).toEqual(expect.stringContaining(detailsText));
  });

  it('POST /api/actions/dispatch/:id updates status of a memo', async () => {
    // 1. Create a draft memo first
    const postRes = await request(app)
      .post('/api/actions/draft')
      .send({ details: "Test memo for dispatch" });

    const memoId = postRes.body.id;
    expect(postRes.body.status).toEqual('DRAFT');

    // 2. Dispatch it
    const dispatchRes = await request(app)
      .post(`/api/actions/dispatch/${memoId}`);

    expect(dispatchRes.statusCode).toEqual(200);
    expect(dispatchRes.body).toEqual({ success: true });

    // 3. Get memos and check that the status has changed
    const getRes = await request(app)
      .get('/api/actions/memos');

    const found = getRes.body.find(m => m.id === memoId);
    expect(found).toBeDefined();
    expect(found.status).toEqual('DISPATCHED');
  });
  
  it('POST /api/actions/dispatch/:id returns 404 for unknown memo ID', async () => {
    const dispatchRes = await request(app)
      .post('/api/actions/dispatch/unknown-memo-id-12345');

    expect(dispatchRes.statusCode).toEqual(404);
    expect(dispatchRes.body).toEqual({ error: 'Memo not found' });
  });
});
