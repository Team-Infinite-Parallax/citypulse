import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Ensure the API key is picked up from process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are CityPulse, a traffic data assistant. You are given a JSON excerpt of relevant traffic records below. Answer the user's question using ONLY this data — do not use outside knowledge. Respond as strict JSON in this exact shape: { "answer": string, "chart_data": array of {label, value} objects suitable for a bar/line chart, "cited_points": array of the raw data records you used }. If the data doesn't answer the question, say so in "answer" and return empty arrays for the others.`;

export const generateQueryResponse = async (question, dataChunk) => {
  const prompt = `DATA: ${JSON.stringify(dataChunk)}\nQUESTION: ${question}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest', // Note: use 'gemini-2.5-flash' if 'gemini-flash-latest' is not recognized, but sticking to instructions
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });

    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
