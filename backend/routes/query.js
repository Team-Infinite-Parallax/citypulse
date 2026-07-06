import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateQueryResponse,
  embedTexts,
  generateEmbeddings,
  cosineSimilarity,
  embeddingMode,
} from '../lib/gemini.js';
import { getTrafficData } from '../lib/db.js';
import { getAllChunks, upsertChunks, searchSimilar } from '../lib/vectorStore.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOP_K = 3;
const MIN_SIMILARITY = 0.15; // below this, retrieval is treated as a miss

// Shared confidence banding used by every explainability panel.
const confidenceLabel = (score) =>
  score >= 0.45 ? 'high' : score >= 0.25 ? 'medium' : 'low';

/* -------------------------------------------------------------------------- */
/*  Retrieval index — build one text summary ("chunk") per corridor, embed it  */
/*  once, and cache the vectors in memory. In production this cache would live  */
/*  in a vector DB (AlloyDB / pgvector). We rebuild only when the underlying    */
/*  record count changes, so queries don't re-embed on every request.          */
/* -------------------------------------------------------------------------- */

const TOURISM_POI_DATA = [
  { name: 'MG Road Shopping District', ward: 'MG Road', category: 'shopping', footfall: 8500, rating: 4.2 },
  { name: 'Indiranagar 100ft Road', ward: 'Indiranagar', category: 'dining', footfall: 7200, rating: 4.5 },
  { name: 'Koramangala Food Street', ward: 'Koramangala', category: 'dining', footfall: 6400, rating: 4.4 },
  { name: 'Lalbagh Botanical Garden', ward: 'Jayanagar', category: 'park', footfall: 5200, rating: 4.6 },
  { name: 'Cubbon Park', ward: 'MG Road', category: 'park', footfall: 4800, rating: 4.7 },
];

const ENERGY_WARD_DATA = [
  { ward: 'MG Road', solar_pct: 12, green_pct: 18, water_loss: 18 },
  { ward: 'Indiranagar', solar_pct: 24, green_pct: 31, water_loss: 12 },
  { ward: 'Koramangala', solar_pct: 18, green_pct: 22, water_loss: 14 },
  { ward: 'Hebbal', solar_pct: 8, green_pct: 12, water_loss: 22 },
  { ward: 'Jayanagar', solar_pct: 32, green_pct: 38, water_loss: 10 },
];

export const buildDomainSummaries = (trafficData, incidentsData, envData) => {
  const byRoute = {};
  for (const r of trafficData) {
    if (!byRoute[r.route_name]) {
      byRoute[r.route_name] = {
        route_name: r.route_name,
        records: [],
        congestion: 0,
        delay: 0,
        aqi: 0,
        aqiCount: 0,
        incidents: 0,
        hourly: Array.from({ length: 24 }, () => ({ total: 0, count: 0 })),
      };
    }
    const s = byRoute[r.route_name];
    s.records.push(r);
    s.congestion += r.congestion;
    s.delay += r.delay_minutes;
    if (typeof r.aqi === 'number') {
      s.aqi += r.aqi;
      s.aqiCount += 1;
    }
    if (r.notes && /incident/i.test(r.notes)) s.incidents += 1;
    const h = new Date(r.timestamp).getHours();
    s.hourly[h].total += r.congestion;
    s.hourly[h].count += 1;
  }

  const trafficChunks = Object.values(byRoute).map((s) => {
    const n = s.records.length || 1;
    const avgCong = Math.round(s.congestion / n);
    const avgDelay = Math.round(s.delay / n);
    const avgAqi = s.aqiCount ? Math.round(s.aqi / s.aqiCount) : null;
    let peakHour = 0;
    let peakVal = -1;
    s.hourly.forEach((hr, i) => {
      if (hr.count && hr.total / hr.count > peakVal) {
        peakVal = hr.total / hr.count;
        peakHour = i;
      }
    });
    const stats = {
      route_name: s.route_name,
      avg_congestion: avgCong,
      avg_delay_minutes: avgDelay,
      avg_aqi: avgAqi,
      peak_hour: `${String(peakHour).padStart(2, '0')}:00`,
      incident_count: s.incidents,
      domain: 'mobility',
    };

    const congWord =
      avgCong >= 70 ? 'severe congestion gridlock heavy traffic jam'
      : avgCong >= 40 ? 'moderate congestion busy traffic'
      : 'light free-flowing traffic clear';
    const aqiWord =
      avgAqi == null ? ''
      : avgAqi >= 150 ? 'hazardous toxic unhealthy polluted dirty air worst pollution smog'
      : avgAqi >= 100 ? 'unhealthy poor polluted air pollution sensitive groups'
      : avgAqi >= 50 ? 'moderate air quality'
      : 'good clean healthy air';
    const incidentWord = s.incidents > 0
      ? `${s.incidents} incident accident reported`
      : 'no incidents';

    const text =
      `Corridor ${s.route_name}: ${congWord}, average congestion ${avgCong} out of 100, ` +
      `average delay ${avgDelay} minutes, busiest at ${stats.peak_hour}. ` +
      `Air quality index AQI averages ${avgAqi ?? 'n/a'} — ${aqiWord}. ` +
      `${incidentWord}. Topics: traffic commute delay, air quality pollution health.`;
    return { route_name: s.route_name, domain: 'mobility', text, records: s.records, stats };
  });

  const byWard = {};
  for (const inc of incidentsData) {
    if (!byWard[inc.ward]) byWard[inc.ward] = { ward: inc.ward, incidents: [], env: [] };
    byWard[inc.ward].incidents.push(inc);
  }
  for (const env of envData) {
    if (!byWard[env.wardId]) byWard[env.wardId] = { ward: env.wardId, incidents: [], env: [] };
    byWard[env.wardId].env.push(env);
  }

  const wardChunks = Object.values(byWard).map(w => {
    const latestEnv = w.env.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    const aqi = latestEnv?.aqi || 'n/a';
    const waste = latestEnv?.waste_collection_efficiency_pct || 'n/a';
    const water = latestEnv?.water_quality_index || 'n/a';

    const energy = ENERGY_WARD_DATA.find(e => e.ward === w.ward);
    const tourism = TOURISM_POI_DATA.filter(p => p.ward === w.ward);
    
    const text = `Ward ${w.ward}: Public safety incidents reported: ${w.incidents.length}. ` +
      `Types of incidents: ${[...new Set(w.incidents.map(i => i.type))].join(', ')}. ` +
      `Environment metrics: AQI ${aqi}, Waste collection efficiency ${waste}%, Water quality index ${water}. ` +
      (energy ? `Energy: solar adoption ${energy.solar_pct}%, green energy ${energy.green_pct}%, water loss ${energy.water_loss}%. ` : '') +
      (tourism.length ? `Tourism POIs: ${tourism.map(p => `${p.name} (rating ${p.rating}, ${p.footfall} daily)`).join('; ')}. ` : '') +
      `Topics: safety, crime, environment, livability, waste management, energy, tourism, local economy.`;
    
    const stats = {
      ward: w.ward,
      incident_count: w.incidents.length,
      aqi,
      waste_efficiency: waste,
      water_quality: water,
      solar_adoption: energy?.solar_pct || 'n/a',
      green_energy: energy?.green_pct || 'n/a',
      tourism_pois: tourism.length,
      domain: 'ward_health_safety'
    };

    return { route_name: w.ward, domain: 'ward_health_safety', text, records: [...w.incidents, ...w.env].slice(0, 50), stats };
  });

  return [...trafficChunks, ...wardChunks];
};

let currentSignature = null;
let cachedTraffic = null;
let cachedIncidents = null;
let cachedEnv = null;

const ensureDomainData = async () => {
  if (cachedTraffic && cachedIncidents && cachedEnv) return;
  cachedTraffic = await getTrafficData();
  try {
    cachedIncidents = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'incidents.json'), 'utf-8'));
    cachedEnv = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'environment.json'), 'utf-8'));
  } catch(e) {
    console.error('Error loading extra domains for query data', e);
    cachedIncidents = cachedIncidents || [];
    cachedEnv = cachedEnv || [];
  }
};

const syncVectorStore = async () => {
  await ensureDomainData();

  const signature = `${cachedTraffic.length}-${cachedIncidents.length}-${cachedEnv.length}`;
  if (currentSignature === signature) return;

  console.log(`[Query] Data signature changed to ${signature}. Syncing vector store...`);
  
  // 1. Generate summaries
  const summaries = buildDomainSummaries(cachedTraffic, cachedIncidents, cachedEnv);
  
  // 2. Fetch existing chunks from vector store
  const existingChunks = await getAllChunks();
  const existingMap = new Map(existingChunks.map(c => [c.id, c]));

  const chunksToUpsert = [];
  const textsToEmbed = [];
  const textIndexMap = []; // index in summaries -> index in textsToEmbed

  for (let i = 0; i < summaries.length; i++) {
    const s = summaries[i];
    const chunkId = `${s.domain}_${s.route_name}`;
    s.id = chunkId;

    const existing = existingMap.get(chunkId);
    if (existing && existing.text === s.text && Array.isArray(existing.embedding) && existing.embedding.length > 0) {
      // Content has not changed, reuse existing embedding
      s.embedding = existing.embedding;
      chunksToUpsert.push(s);
    } else {
      // Content has changed or is new, needs embedding
      textsToEmbed.push(s.text);
      textIndexMap.push(i);
    }
  }

  if (textsToEmbed.length > 0) {
    console.log(`[Query] Embedding ${textsToEmbed.length} new/changed chunks...`);
    const newEmbeddings = await embedTexts(textsToEmbed, 'RETRIEVAL_DOCUMENT');
    for (let k = 0; k < newEmbeddings.length; k++) {
      const summaryIdx = textIndexMap[k];
      const s = summaries[summaryIdx];
      s.embedding = newEmbeddings[k];
      chunksToUpsert.push(s);
    }
  }

  // 3. Upsert into vector store
  if (chunksToUpsert.length > 0) {
    await upsertChunks(chunksToUpsert);
    console.log(`[Query] Upserted ${chunksToUpsert.length} chunks into vector store.`);
  }

  currentSignature = signature;
};

router.post('/', async (req, res) => {
  const { question } = req.body || {};

  // Input validation
  if (typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'A non-empty "question" string is required.' });
  }
  if (question.length > 500) {
    return res.status(400).json({ error: 'Question too long (max 500 characters).' });
  }

  try {
    await syncVectorStore();

    // Embed the query and rank chunks by cosine similarity (genuine retrieval).
    const queryEmbedding = await generateEmbeddings(question, 'RETRIEVAL_QUERY');
    const matches = await searchSimilar(queryEmbedding, TOP_K);

    const top = matches.filter((r) => r.score >= MIN_SIMILARITY);
    const selected = top.length ? top : matches.slice(0, TOP_K); // always give the LLM something

    // Assemble retrieved context: recent records from the top corridors/wards.
    const contextData = selected.flatMap(({ chunk }) => {
      let records = [];
      if (chunk.domain === 'mobility') {
        records = cachedTraffic.filter(r => r.route_name === chunk.route_name);
      } else if (chunk.domain === 'ward_health_safety') {
        records = [
          ...cachedIncidents.filter(i => i.ward === chunk.route_name),
          ...cachedEnv.filter(e => e.wardId === chunk.route_name)
        ];
      }
      return [...records]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 40);
    });

    const retrieval = selected.map(({ chunk, score }) => ({
      route_name: chunk.route_name,
      similarity: Number(score.toFixed(3)),
      summary: chunk.stats,
    }));

    let rawResponse = await generateQueryResponse(question, contextData);
    rawResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(rawResponse);
    const topScore = retrieval.length ? retrieval[0].similarity : 0;
    res.json({
      ...parsed,
      retrieval, // transparency: which corridors were retrieved and their scores
      retrieval_method: `cosine similarity over ${embeddingMode()} embeddings`,
      // Explainability contract shared across all AI outputs (Task 1.2).
      explain: {
        confidence: topScore,
        confidence_label: confidenceLabel(topScore),
        rationale:
          parsed.reasoning ||
          `Answer grounded on ${selected.length} retrieved source summary(ies); top similarity ${topScore}.`,
        sources: retrieval,
        method: `cosine similarity over ${embeddingMode()} embeddings (top-${TOP_K})`,
      },
    });
  } catch (error) {
    console.error('Query Error:', error.message);
    res.json({
      answer: "Sorry, I couldn't process that question right now due to a service error.",
      chart_data: [],
      cited_points: [],
      retrieval: [],
      explain: { confidence: 0, confidence_label: 'low', rationale: 'The AI service errored before an answer could be grounded.', sources: [], method: 'n/a' },
    });
  }
});

export default router;
