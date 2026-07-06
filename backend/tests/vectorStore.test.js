import request from 'supertest';
import express from 'express';
import queryRoutes from '../routes/query.js';
import { searchSimilar, getAllChunks } from '../lib/vectorStore.js';

const app = express();
app.use(express.json());
app.use('/api/query', queryRoutes);

describe('CityPulse pgvector/AlloyDB Integration (Fallback Mode)', () => {
  it('should seed and load chunks from the fallback local cache', async () => {
    // A query triggers syncVectorStore(), which builds + embeds the domain
    // chunks — so this passes on a fresh clone with no pre-built cache file.
    await request(app)
      .post('/api/query')
      .send({ question: 'seed the vector store' });

    const chunks = await getAllChunks();
    expect(Array.isArray(chunks)).toBe(true);
    expect(chunks.length).toBeGreaterThan(0);
    
    // Inspect a sample chunk structure
    const chunk = chunks[0];
    expect(chunk).toHaveProperty('id');
    expect(chunk).toHaveProperty('route_name');
    expect(chunk).toHaveProperty('domain');
    expect(chunk).toHaveProperty('text');
    expect(chunk).toHaveProperty('embedding');
    expect(chunk).toHaveProperty('stats');
    expect(Array.isArray(chunk.embedding)).toBe(true);
    expect(chunk.embedding.length).toBe(768);
  });

  it('should rank similarity search matches accurately using cosine similarity fallback', async () => {
    const dummyQuery = new Array(768).fill(0);
    // Give index 10 and 20 a non-zero value so it has some magnitude
    dummyQuery[10] = 0.5;
    dummyQuery[20] = 0.5;

    const matches = await searchSimilar(dummyQuery, 3);
    expect(Array.isArray(matches)).toBe(true);
    expect(matches.length).toBeLessThanOrEqual(3);
    
    if (matches.length > 0) {
      expect(matches[0]).toHaveProperty('chunk');
      expect(matches[0]).toHaveProperty('score');
      expect(typeof matches[0].score).toBe('number');
      expect(matches[0].score).toBeLessThanOrEqual(1.0);
      expect(matches[0].score).toBeGreaterThanOrEqual(-1.0);
      
      // Matches should be sorted by score descending
      if (matches.length > 1) {
        expect(matches[0].score).toBeGreaterThanOrEqual(matches[1].score);
      }
    }
  });

  it('POST /api/query returns correct response shape', async () => {
    const res = await request(app)
      .post('/api/query')
      .send({ question: 'How is Lucknow traffic congestion today?' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('answer');
    expect(res.body).toHaveProperty('retrieval');
    expect(res.body).toHaveProperty('explain');
    
    expect(Array.isArray(res.body.retrieval)).toBe(true);
    expect(res.body.explain).toHaveProperty('confidence');
    expect(res.body.explain).toHaveProperty('confidence_label');
    expect(res.body.explain).toHaveProperty('rationale');
    expect(res.body.explain).toHaveProperty('sources');
    expect(res.body.explain).toHaveProperty('method');
  });

  it('POST /api/query rejects empty query with 400', async () => {
    const res = await request(app)
      .post('/api/query')
      .send({ question: '' });

    expect(res.statusCode).toEqual(400);
  });
});
