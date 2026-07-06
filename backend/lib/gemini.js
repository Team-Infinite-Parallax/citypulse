import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';
dotenv.config();

const projectId = process.env.GCP_PROJECT_ID || 'dummy-project-id';
const location = 'us-central1';

let vertexai, generativeModel;
let useVertex = process.env.GCP_PROJECT_ID ? true : false;

try {
  if (useVertex) {
    vertexai = new VertexAI({ project: projectId, location });
    
    const SYSTEM_INSTRUCTION = `You are CityPulse, a traffic data assistant. You are given a JSON excerpt of relevant traffic records below. Answer the user's question using ONLY this data — do not use outside knowledge. Respond as strict JSON in this exact shape: { "answer": string, "chart_data": array of {label, value} objects suitable for a bar/line chart, "cited_points": array of the raw data records you used }. If the data doesn't answer the question, say so in "answer" and return empty arrays for the others.`;

    generativeModel = vertexai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: { parts: [{text: SYSTEM_INSTRUCTION}] },
    });
  }
} catch (err) {
  console.warn("Failed to initialize Vertex AI:", err.message);
  useVertex = false;
}

export const generateQueryResponse = async (question, dataChunk) => {
  if (!useVertex) {
    return JSON.stringify({
      answer: "Vertex AI is not configured. Please set GCP_PROJECT_ID and authenticate.",
      chart_data: [],
      cited_points: []
    });
  }
  
  const prompt = `DATA: ${JSON.stringify(dataChunk)}\nQUESTION: ${question}`;
  try {
    const response = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });
    return response.response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Vertex AI Error:", error);
    throw error;
  }
};

export const generateRecommendation = async (route_name, supporting_data) => {
  if (!useVertex) {
    return `Review traffic management strategies for ${route_name} due to high peak-hour congestion.`;
  }
  
  const recModel = vertexai.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Based on the following traffic data for ${route_name} showing high peak-hour congestion, provide a single, actionable, one-line recommendation to city planners to alleviate this specific issue (e.g., adjust signal timing, increase bus frequency, add dedicated lanes). Do not explain, just provide the one-line recommendation.
DATA: ${JSON.stringify(supporting_data)}`;
  
  try {
    const response = await recModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    return response.response.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Vertex AI Error (Recommendation):", error);
    return `Review traffic management strategies for ${route_name} due to high peak-hour congestion.`;
  }
};

// Very basic embedding mock since Vertex AI SDK for embeddings varies and often requires aiplatform
// In a real hackathon, we would wire this to the Vertex AI Embeddings API.
export const generateEmbeddings = async (text) => {
  // Mock embeddings generation: returns a 768-dim vector based on char codes
  const vec = Array(768).fill(0);
  for (let i = 0; i < text.length; i++) {
    vec[i % 768] += text.charCodeAt(i);
  }
  // Normalize
  const mag = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  return vec.map(v => mag ? v / mag : 0);
};

export const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};
