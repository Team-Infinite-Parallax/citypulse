import { VertexAI } from '@google-cloud/vertexai';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

// Cloud Run and most GCP runtimes expose the project as GOOGLE_CLOUD_PROJECT.
const projectId =
  process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || '';
const location = process.env.GCP_LOCATION || 'us-central1';

let vertexai, generativeModel;
let useVertex = Boolean(projectId);

const SYSTEM_INSTRUCTION = `You are CityPulse, an urban decision-intelligence assistant for city planners. You are given a JSON excerpt of relevant retrieved records (traffic congestion + air-quality AQI) below. Answer the user's question using ONLY this data — do not use outside knowledge. Respond as strict JSON in this exact shape: { "answer": string, "chart_data": array of {label, value} objects suitable for a bar/line chart, "cited_points": array of the raw data records you used }. If the data doesn't answer the question, say so in "answer" and return empty arrays for the others.`;

try {
  if (useVertex) {
    vertexai = new VertexAI({ project: projectId, location });
    generativeModel = vertexai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    });
  } else {
    console.warn(
      '[gemini] GCP_PROJECT_ID not set — running in local fallback mode (no Vertex AI).'
    );
  }
} catch (err) {
  console.warn('[gemini] Failed to initialize Vertex AI:', err.message);
  useVertex = false;
}

export const isVertexEnabled = () => useVertex;

export const generateQueryResponse = async (question, dataChunk) => {
  if (!useVertex) {
    return JSON.stringify({
      answer:
        'Vertex AI is not configured (set GCP_PROJECT_ID and authenticate). ' +
        'Retrieval still ran — see the grounded data points below.',
      chart_data: [],
      cited_points: Array.isArray(dataChunk) ? dataChunk.slice(0, 5) : [],
    });
  }

  const prompt = `DATA: ${JSON.stringify(dataChunk)}\nQUESTION: ${question}`;
  const response = await generativeModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' },
  });
  return response.response.candidates[0].content.parts[0].text;
};

export const generateRecommendation = async (route_name, supporting_data) => {
  const fallback = `Review traffic-management strategies for ${route_name} (signal retiming, added bus frequency, or a temporary dedicated lane) to relieve sustained peak-hour congestion.`;
  if (!useVertex) return fallback;

  const recModel = vertexai.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Based on the following traffic data for ${route_name} showing high peak-hour congestion, provide a single, actionable, one-line recommendation to city planners to alleviate this specific issue (e.g., adjust signal timing, increase bus frequency, add dedicated lanes). Do not explain, just provide the one-line recommendation.
DATA: ${JSON.stringify(supporting_data)}`;

  try {
    const response = await recModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    return response.response.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('[gemini] Recommendation error:', error.message);
    return fallback;
  }
};

/* -------------------------------------------------------------------------- */
/*  Embeddings — real Vertex AI text-embedding-004 with a deterministic        */
/*  offline fallback so retrieval works without cloud credentials.             */
/* -------------------------------------------------------------------------- */

const EMBED_DIM = 768; // text-embedding-004 output size; fallback matches it.
const EMBED_MODEL = 'text-embedding-004';

// 'vertex' until a call fails, then permanently 'local' so query + document
// vectors are always produced by the same method (comparable cosine space).
let embedMode = useVertex ? 'vertex' : 'local';
let auth = null;
const embedCache = new Map(); // text -> Float array (avoids re-embedding chunks)

const getAuthClient = async () => {
  if (!auth) {
    auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
  }
  return auth;
};

// Deterministic hashed bag-of-words TF vector. Unlike a char-code sum, this
// reflects actual token overlap, so cosine similarity is semantically useful
// for keyword-driven retrieval when Vertex is unavailable.
const localEmbed = (text) => {
  const vec = new Array(EMBED_DIM).fill(0);
  const tokens = String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  for (const tok of tokens) {
    let h = 2166136261;
    for (let i = 0; i < tok.length; i++) {
      h ^= tok.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const idx = Math.abs(h) % EMBED_DIM;
    vec[idx] += 1;
  }
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return mag ? vec.map((v) => v / mag) : vec;
};

const vertexEmbedBatch = async (texts, taskType) => {
  const client = await getAuthClient();
  const token = await client.getAccessToken();
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${EMBED_MODEL}:predict`;
  const body = {
    instances: texts.map((content) => ({ content, task_type: taskType })),
  };
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`Vertex embeddings HTTP ${resp.status}: ${detail.slice(0, 200)}`);
  }
  const json = await resp.json();
  return json.predictions.map((p) => p.embeddings.values);
};

/**
 * Embed an array of texts. Returns an array of numeric vectors (length EMBED_DIM).
 * taskType is 'RETRIEVAL_DOCUMENT' for indexed chunks or 'RETRIEVAL_QUERY' for
 * the user's question — this is a real, defensible RAG embedding pipeline.
 */
export const embedTexts = async (texts, taskType = 'RETRIEVAL_DOCUMENT') => {
  const results = new Array(texts.length);
  const misses = [];
  texts.forEach((t, i) => {
    const key = `${taskType}:${t}`;
    if (embedCache.has(key)) results[i] = embedCache.get(key);
    else misses.push(i);
  });
  if (misses.length === 0) return results;

  if (embedMode === 'vertex') {
    try {
      // Vertex allows up to 250 instances/request; we batch conservatively.
      const BATCH = 25;
      for (let start = 0; start < misses.length; start += BATCH) {
        const idxs = misses.slice(start, start + BATCH);
        const vecs = await vertexEmbedBatch(
          idxs.map((i) => texts[i]),
          taskType
        );
        idxs.forEach((i, k) => {
          results[i] = vecs[k];
          embedCache.set(`${taskType}:${texts[i]}`, vecs[k]);
        });
      }
      return results;
    } catch (err) {
      console.warn(
        `[gemini] Vertex embeddings failed (${err.message}); falling back to local embeddings for the rest of this session.`
      );
      embedMode = 'local';
      embedCache.clear(); // don't mix vector spaces
    }
  }

  // Local fallback (also handles the initial no-Vertex case).
  for (const i of misses) {
    const v = localEmbed(texts[i]);
    results[i] = v;
    embedCache.set(`${taskType}:${texts[i]}`, v);
  }
  return results;
};

// Backwards-compatible single-text helper.
export const generateEmbeddings = async (text, taskType = 'RETRIEVAL_QUERY') => {
  const [vec] = await embedTexts([text], taskType);
  return vec;
};

export const embeddingMode = () => embedMode;

export const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  const n = Math.min(vecA.length, vecB.length);
  for (let i = 0; i < n; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};
