import pg from 'pg';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_FILE = path.join(__dirname, '..', 'data', 'chunks_cache.json');

const connectionString = process.env.DATABASE_URL || '';
const useAlloyDB = process.env.USE_ALLOYDB === 'true' && Boolean(connectionString);

let pool;
if (useAlloyDB) {
  try {
    pool = new pg.Pool({ connectionString });
    console.log('[VectorStore] Initialized Postgres pool for AlloyDB/CloudSQL.');
  } catch (err) {
    console.error('[VectorStore] Failed to initialize pg Pool:', err.message);
  }
} else {
  console.warn('[VectorStore] Running in fallback mode (USE_ALLOYDB is false or DATABASE_URL is empty).');
}

// In-memory fallback database/cache
let fallbackStore = {}; // id -> { id, route_name, domain, text, embedding, stats }

// Synchronously load fallback store from disk on startup
try {
  if (fsSync.existsSync(CACHE_FILE)) {
    const data = fsSync.readFileSync(CACHE_FILE, 'utf-8');
    fallbackStore = JSON.parse(data);
    console.log(`[VectorStore Fallback] Loaded ${Object.keys(fallbackStore).length} cached chunks from disk.`);
  }
} catch (err) {
  console.error('[VectorStore Fallback] Failed to load local cache file:', err.message);
}

const saveFallbackStore = async () => {
  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify(fallbackStore, null, 2));
  } catch (err) {
    console.error('[VectorStore Fallback] Failed to write local cache file:', err.message);
  }
};



/**
 * Upsert chunks into vector store.
 * Each chunk: { id, route_name, domain, text, embedding, stats }
 */
export const upsertChunks = async (chunks) => {
  if (useAlloyDB && pool) {
    try {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const queryText = `
          INSERT INTO document_chunks (id, route_name, domain, text, embedding, embed_space, stats, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
          ON CONFLICT (id) DO UPDATE SET
            text = EXCLUDED.text,
            embedding = EXCLUDED.embedding,
            embed_space = EXCLUDED.embed_space,
            stats = EXCLUDED.stats,
            updated_at = NOW();
        `;
        for (const chunk of chunks) {
          const embeddingStr = `[${chunk.embedding.join(',')}]`;
          await client.query(queryText, [
            chunk.id,
            chunk.route_name,
            chunk.domain,
            chunk.text,
            embeddingStr,
            chunk.embed_space || null,
            JSON.stringify(chunk.stats)
          ]);
        }
        await client.query('COMMIT');
        return true;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('[VectorStore] upsertChunks failed, falling back to local cache:', err.message);
    }
  }

  // Fallback
  for (const chunk of chunks) {
    fallbackStore[chunk.id] = { ...chunk };
  }
  await saveFallbackStore();
  return true;
};

/**
 * Retrieve all chunks to check what needs updating
 */
export const getAllChunks = async () => {
  if (useAlloyDB && pool) {
    try {
      const { rows } = await pool.query('SELECT id, route_name, domain, text, embedding, embed_space, stats FROM document_chunks');
      return rows.map(r => {
        let embedding = r.embedding;
        if (typeof embedding === 'string') {
          embedding = embedding.replace(/[\[\]]/g, '').split(',').map(Number);
        }
        return {
          id: r.id,
          route_name: r.route_name,
          domain: r.domain,
          text: r.text,
          embedding,
          embed_space: r.embed_space || null,
          stats: typeof r.stats === 'string' ? JSON.parse(r.stats) : r.stats
        };
      });
    } catch (err) {
      console.error('[VectorStore] getAllChunks failed, falling back to local cache:', err.message);
    }
  }
  return Object.values(fallbackStore);
};

/**
 * Search similar chunks using cosine distance
 */
export const searchSimilar = async (queryEmbedding, topK) => {
  if (useAlloyDB && pool) {
    try {
      const embeddingStr = `[${queryEmbedding.join(',')}]`;
      const queryText = `
        SELECT id, route_name, domain, text, stats, embedding, (embedding <=> $1) as distance
        FROM document_chunks
        ORDER BY distance ASC
        LIMIT $2;
      `;
      const { rows } = await pool.query(queryText, [embeddingStr, topK]);
      return rows.map(r => {
        let embedding = r.embedding;
        if (typeof embedding === 'string') {
          embedding = embedding.replace(/[\[\]]/g, '').split(',').map(Number);
        }
        const score = 1 - parseFloat(r.distance);
        return {
          chunk: {
            id: r.id,
            route_name: r.route_name,
            domain: r.domain,
            text: r.text,
            embedding,
            stats: typeof r.stats === 'string' ? JSON.parse(r.stats) : r.stats
          },
          score
        };
      });
    } catch (err) {
      console.error('[VectorStore] searchSimilar failed, falling back to local cache:', err.message);
    }
  }

  // Fallback calculation using local cosine similarity
  const { cosineSimilarity } = await import('./gemini.js');
  const scored = Object.values(fallbackStore).map(chunk => {
    const score = cosineSimilarity(queryEmbedding, chunk.embedding);
    return { chunk, score };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
};
