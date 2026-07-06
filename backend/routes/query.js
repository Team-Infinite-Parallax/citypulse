import express from 'express';
import { generateQueryResponse, generateEmbeddings, cosineSimilarity } from '../lib/gemini.js';
import { getTrafficData } from '../lib/db.js';

const router = express.Router();

const getTrafficSummary = async () => {
  const data = await getTrafficData();
  const statsByRoute = {};

  data.forEach(record => {
    if (!statsByRoute[record.route_name]) {
      statsByRoute[record.route_name] = {
        route_name: record.route_name,
        total_congestion: 0,
        total_delay: 0,
        count: 0
      };
    }
    const stats = statsByRoute[record.route_name];
    stats.total_congestion += record.congestion;
    stats.total_delay += record.delay_minutes;
    stats.count += 1;
  });

  return Object.values(statsByRoute).map(stats => ({
    route_name: stats.route_name,
    avg_congestion: Math.round(stats.total_congestion / stats.count),
    avg_delay_minutes: Math.round(stats.total_delay / stats.count)
  }));
};

router.post('/', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  const allData = await getTrafficData();
  
  try {
    // 1. Embed the query
    const queryEmbedding = await generateEmbeddings(question);

    // 2. Chunk data by route and embed them
    // In a real app, these would be pre-computed and stored in a vector DB (e.g. Pinecone, AlloyDB pgvector)
    const routes = [...new Set(allData.map(d => d.route_name))];
    
    let bestRoute = null;
    let highestSimilarity = -1;

    for (const route of routes) {
      const routeData = allData.filter(d => d.route_name === route);
      // Create a textual representation of the route for embedding
      const textChunk = `Traffic route ${route} has ${routeData.length} records. Topics: traffic, incident, congestion, delay.`;
      const chunkEmbedding = await generateEmbeddings(textChunk);
      const sim = cosineSimilarity(queryEmbedding, chunkEmbedding);
      
      if (sim > highestSimilarity) {
        highestSimilarity = sim;
        bestRoute = route;
      }
    }

    let contextData = [];
    // 3. Retrieve context
    if (highestSimilarity > 0.5 && bestRoute) {
      // Return top 100 recent records for the best matching route
      contextData = allData
        .filter(d => d.route_name === bestRoute)
        .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 100);
    } else {
      // Fallback: pass summary data
      contextData = await getTrafficSummary();
    }

    let rawResponse = await generateQueryResponse(question, contextData);
    
    rawResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(rawResponse);
    res.json(parsed);
  } catch (error) {
    console.error("Query Error:", error);
    res.json({
      answer: "Sorry, I couldn't process that question right now due to a service error.",
      chart_data: [],
      cited_points: []
    });
  }
});

export default router;
