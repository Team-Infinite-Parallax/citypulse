import pg from 'pg';
import { getTrafficData } from '../lib/db.js';
import { embedTexts, embeddingSpace } from '../lib/gemini.js';
import { upsertChunks } from '../lib/vectorStore.js';
import { buildDomainSummaries } from '../routes/query.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initAlloyDB() {
  const connectionString = process.env.DATABASE_URL;
  const useAlloyDB = process.env.USE_ALLOYDB === 'true' && Boolean(connectionString);

  console.log('--- AlloyDB/pgvector Seeding Script ---');

  if (useAlloyDB) {
    console.log(`DATABASE_URL is set. Connecting to database: ${connectionString.split('@')[1] || 'Postgres'}`);
    const client = new pg.Client({ connectionString });
    
    try {
      await client.connect();
      console.log('Connected. Running migrations: enabling pgvector and creating document_chunks table...');

      // Enable extension
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('pgvector extension ensured.');

      // Create table
      await client.query(`
        CREATE TABLE IF NOT EXISTS document_chunks (
          id VARCHAR(255) PRIMARY KEY,
          route_name VARCHAR(255) NOT NULL,
          domain VARCHAR(255) NOT NULL,
          text TEXT NOT NULL,
          embedding vector(768) NOT NULL,
          embed_space VARCHAR(128),
          stats JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      // Migration for tables created before embed_space existed.
      await client.query('ALTER TABLE document_chunks ADD COLUMN IF NOT EXISTS embed_space VARCHAR(128);');
      console.log('document_chunks table created/ensured.');
      await client.end();
    } catch (err) {
      console.error('Error running database schema migration:', err);
      process.exit(1);
    }
  } else {
    console.log('DATABASE_URL is empty or USE_ALLOYDB is false. Initializing local fallback cache file...');
  }

  // Load datasets to summarize and embed
  try {
    const trafficData = await getTrafficData();
    const incidentsData = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'incidents.json'), 'utf-8'));
    const envData = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'environment.json'), 'utf-8'));

    console.log(`Read ${trafficData.length} traffic, ${incidentsData.length} incidents, and ${envData.length} env records.`);
    
    const summaries = buildDomainSummaries(trafficData, incidentsData, envData);
    console.log(`Generated ${summaries.length} document chunks to embed.`);

    console.log('Generating embeddings...');
    const embeddings = await embedTexts(
      summaries.map(c => c.text),
      'RETRIEVAL_DOCUMENT'
    );

    const chunks = summaries.map((c, i) => ({
      id: `${c.domain}_${c.route_name}`,
      route_name: c.route_name,
      domain: c.domain,
      text: c.text,
      embedding: embeddings[i],
      embed_space: embeddingSpace(),
      stats: c.stats
    }));

    console.log('Upserting chunks...');
    await upsertChunks(chunks);
    console.log('Successfully seeded chunks!');
  } catch (error) {
    console.error('Error seeding chunks:', error);
  }
}

initAlloyDB();
