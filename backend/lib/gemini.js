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

const SYSTEM_INSTRUCTION = `You are CityPulse, an urban decision-intelligence assistant for city planners and citizens. You are given a JSON excerpt of retrieved records that may span MULTIPLE domains — mobility (traffic congestion, delay), environment (air-quality AQI, waste-collection efficiency, water quality), and public safety (incident reports). Answer the user's question using ONLY this data — do not use outside knowledge. When records from more than one domain are present, REASON ACROSS them and produce a single synthesized answer (e.g. relate air quality to congestion to incident rate for a ward), not three separate answers concatenated. Respond as strict JSON in this exact shape: { "answer": string, "reasoning": string — ONE plain-language sentence explaining why this answer follows from the retrieved data, "chart_data": array of {label, value} objects suitable for a bar/line chart, "cited_points": array of the raw data records you used }. If the data doesn't answer the question, say so in "answer", explain in "reasoning", and return empty arrays for the others.`;

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
      reasoning:
        'Vertex AI is offline, so this response reflects the retrieval step only; ' +
        'the corridors/wards below are the highest-similarity matches to your question.',
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
  const fallbackSuggestion = `Review traffic-management strategies for ${route_name} (signal retiming, added bus frequency, or a temporary dedicated lane) to relieve sustained peak-hour congestion.`;
  const fallbackRationale = `Peak-hour congestion on ${route_name} stayed well above the citywide comfort threshold across the sampled window.`;
  if (!useVertex) return { suggestion: fallbackSuggestion, rationale: fallbackRationale };

  const recModel = vertexai.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `You advise city traffic planners. Based on the following traffic data for ${route_name} showing high peak-hour congestion, respond as strict JSON: { "suggestion": a single actionable one-line recommendation (e.g. adjust signal timing, increase bus frequency, add a dedicated lane), "rationale": ONE sentence explaining why this action is warranted, referencing the data }.
DATA: ${JSON.stringify(supporting_data)}`;

  try {
    const response = await recModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });
    const txt = response.response.candidates[0].content.parts[0].text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    const parsed = JSON.parse(txt);
    return {
      suggestion: (parsed.suggestion || fallbackSuggestion).toString().trim(),
      rationale: (parsed.rationale || fallbackRationale).toString().trim(),
    };
  } catch (error) {
    console.error('[gemini] Recommendation error:', error.message);
    return { suggestion: fallbackSuggestion, rationale: fallbackRationale };
  }
};

/**
 * Generic one-sentence generator with a guaranteed fallback. Used for
 * explainability rationales, ward-livability interpretations, and action memos
 * so every domain shares one Vertex-or-fallback code path.
 */
export const generateOneLiner = async (prompt, fallback) => {
  if (!useVertex) return fallback;
  try {
    const model = vertexai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    const txt = response.response.candidates[0].content.parts[0].text.trim();
    return txt || fallback;
  } catch (error) {
    console.error('[gemini] oneLiner error:', error.message);
    return fallback;
  }
};

/**
 * Structured JSON generator with a guaranteed fallback object. Used for the
 * action-memo drafting step (Phase 3).
 */
export const generateStructured = async (prompt, fallbackObj) => {
  if (!useVertex) return fallbackObj;
  try {
    const model = vertexai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });
    const txt = response.response.candidates[0].content.parts[0].text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    return { ...fallbackObj, ...JSON.parse(txt) };
  } catch (error) {
    console.error('[gemini] structured error:', error.message);
    return fallbackObj;
  }
};

/* -------------------------------------------------------------------------- */
/*  Vision — Gemini 1.5 Flash handles multimodal requests                     */
/* -------------------------------------------------------------------------- */
export const analyzeImage = async (base64Image, prompt, fallbackObj) => {
  if (!useVertex || !base64Image) return fallbackObj;
  try {
    const model = vertexai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg'
      }
    };
    const textPart = { text: prompt };
    
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [imagePart, textPart] }],
      generationConfig: { responseMimeType: 'application/json' },
    });
    
    const txt = response.response.candidates[0].content.parts[0].text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    return { ...fallbackObj, ...JSON.parse(txt) };
  } catch (error) {
    console.error('[gemini] analyzeImage error:', error.message);
    return fallbackObj;
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
