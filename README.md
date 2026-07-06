# CityPulse 🏙️

**CityPulse** is an AI-powered Decision Intelligence Platform designed for urban mobility and environmental monitoring. It aggregates traffic congestion data and Air Quality Index (AQI) metrics to provide city planners with a comprehensive, real-time dashboard. 

Powered by **Google Cloud**, CityPulse leverages **Vertex AI** for forecasting and Natural Language querying, enabling planners to literally "Ask the City" about current conditions and receive actionable recommendations.

## 🚀 Features

- **Live Congestion & AQI Map**: A dark-mode, MapLibre-powered live view of 5 major city corridors.
- **KPI Dashboard**: Real-time trend charts for congestion and delay times.
- **Anomaly Detection & Alerts**: Automatic flagging of severe congestion and incidents.
- **"Ask the City" (RAG Interface)**: A natural-language query bar powered by Vertex AI (Gemini 1.5 Flash) and vector embeddings to answer specific questions about the city's state.
- **AI Forecasting & Recommendations**: Simple Moving Average forecasting combined with LLM-generated actionable recommendations for city planners.

## 🏗 Architecture & Google Cloud Integration

CityPulse is built as a modern full-stack application and natively integrates with the Google Cloud ecosystem:

1. **Frontend**: Astro + React Islands + TailwindCSS + Recharts
2. **Backend**: Express.js (Node) API
3. **Data Layer**: 
   - Uses **BigQuery** to query traffic and environmental data live.
   - (Includes a fallback JSON data layer for local development without credentials).
4. **AI/ML (Vertex AI)**:
   - Uses `gemini-1.5-flash` via the `@google-cloud/vertexai` SDK for natural language queries and recommendations.
   - Implements **Genuine RAG** by generating vector embeddings of route summaries and performing cosine similarity search.
5. **Deployment**:
   - Containerized backend designed for **Cloud Run**.
   - Automated deployment pipeline via **Cloud Build** and GitHub Actions.

## 🛠️ Tech Stack

- **GCP Services**: Vertex AI, BigQuery, Cloud Run, Cloud Build
- **Frontend**: Astro, React, TailwindCSS, Zustand
- **Backend**: Express.js, Jest for testing

## 🚦 Local Setup

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. **Google Cloud Authentication** (Required for Vertex AI / BigQuery)
   ```bash
   gcloud auth application-default login
   ```
4. **Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3001
   GCP_PROJECT_ID=your-google-cloud-project-id
   USE_BIGQUERY=false # Set to true if you run the init script
   ```
5. **Run the Application**
   - Start the backend: `cd backend && npm run dev`
   - Start the frontend: `cd frontend && npm run dev`
6. **View the App**
   Open `http://localhost:4321` in your browser.

## 📸 Screenshots
*(Insert Screenshots here)*

## 🎥 Live Demo
*(Insert Live Demo Link/Video here)*

---
*Built for the Google Cloud Hackathon*