# CityPulse 🏙️

**CityPulse** is an AI-powered **urban decision-intelligence platform**. It fuses two civic domains — **urban mobility** (traffic congestion) and **environmental & community wellness** (air quality) — into one real-time operations dashboard for city planners.

Powered by **Google Cloud Vertex AI**, CityPulse lets planners literally *"Ask the City"* in natural language, forecasts near-term conditions, and turns raw telemetry into actionable, health-aware recommendations.

## 🚀 Features

- **Live Congestion & AQI Map** — a dark-mode, MapLibre view of 5 major Bengaluru corridors, colored by live congestion.
- **KPI Dashboard** — real-time congestion trend, delay-by-route, peak-hour and average-AQI cards.
- **Anomaly Detection & Alerts** — automatic flagging of severe congestion and logged incidents.
- **"Ask the City" — genuine RAG** — a natural-language query bar backed by **real vector retrieval**: each corridor is summarized into a text chunk, embedded with Vertex AI `text-embedding-004`, and matched to the user's query by **cosine similarity** (top-k). The API returns the retrieved corridors *and their similarity scores* for full transparency.
- **Seasonal-Naive Forecasting** — predicts each corridor's next-hour congestion, delay and AQI from its hour-of-day seasonal profile, corrected by the latest residual. The recommendation text is genuinely downstream of a prediction.
- **Health & Air-Quality Advisories (2nd domain)** — cross-references AQI with peak-hour congestion to produce **vulnerable-group advisories** (children, elderly, respiratory/cardiac patients), mapping directly to the challenge's *Healthcare Access & Community Wellness* solution area.

## 🏗 Architecture

```
┌────────────────────────────┐        ┌─────────────────────────────────────────┐
│  Frontend (Astro + React)  │        │        Backend (Express / Cloud Run)      │
│  MapLibre · Recharts · TW  │        │                                           │
│                            │  HTTP  │  /api/traffic   /api/query   /api/forecast│
│  Dashboard · MapView       │ ─────► │  /api/alerts    /api/advisories           │
│  QueryBar · HealthAdvisory │        │        │                │                 │
└────────────────────────────┘        │        ▼                ▼                 │
                                       │   ┌─────────┐    ┌──────────────┐         │
                                       │   │ db.js   │    │  gemini.js   │         │
                                       │   │ BigQuery│    │  Vertex AI   │         │
                                       │   │ (+JSON  │    │  Gemini 1.5  │         │
                                       │   │  fallbk)│    │  + embeddings│         │
                                       │   └─────────┘    └──────────────┘         │
                                       └─────────────────────────────────────────┘
```

The backend is **degradation-tolerant**: with no cloud credentials it falls back to a bundled JSON dataset and a deterministic local embedding, so the full app runs offline for local dev and CI. Set `GCP_PROJECT_ID` (+ ADC) to activate Vertex AI, and `USE_BIGQUERY=true` to query BigQuery live.

## ☁️ Google Cloud Services Used

| Service | Where | Why |
|---|---|---|
| **Vertex AI — Gemini 1.5 Flash** | `lib/gemini.js` | Natural-language answers + planner recommendations |
| **Vertex AI — text-embedding-004** | `lib/gemini.js`, `routes/query.js` | Real embeddings powering cosine-similarity RAG |
| **BigQuery** | `lib/db.js`, `scripts/init_bq.js` | Live analytical queries over traffic + AQI data |
| **Cloud Run** | `Dockerfile`, `cloudbuild.yaml` | Containerized, autoscaling backend |
| **Cloud Build + GitHub Actions** | `.github/workflows/deploy.yml` | CI (tests) → build → deploy pipeline |

## 🛠️ Tech Stack

- **Frontend**: Astro, React (islands), TailwindCSS, Recharts, MapLibre GL, Zustand
- **Backend**: Express.js (ESM), Jest + Supertest
- **GCP**: Vertex AI, BigQuery, Cloud Run, Cloud Build

## 🚦 Local Setup

1. **Install dependencies**
   ```bash
   cd backend  && npm install
   cd ../frontend && npm install
   ```
2. **(Optional) Google Cloud** — for live Vertex AI / BigQuery:
   ```bash
   gcloud auth application-default login
   ```
3. **Environment** — copy `.env.example` and fill in as needed.
   - `backend/.env`: `PORT`, `GCP_PROJECT_ID` (blank = offline fallback), `USE_BIGQUERY`.
   - `frontend/.env`: `PUBLIC_API_URL` — **leave blank locally** (the Astro dev server proxies `/api` → `http://localhost:3001`); set it to the Cloud Run URL for production builds.
4. **(Optional) Generate fresh data / load BigQuery**
   ```bash
   cd backend
   node scripts/generate_data.js   # regenerates data/traffic.json (traffic + AQI)
   node scripts/init_bq.js         # creates the BigQuery dataset/table and uploads
   ```
5. **Run**
   ```bash
   cd backend  && npm run dev      # http://localhost:3001
   cd frontend && npm run dev      # http://localhost:4321
   ```

## 🧪 Tests

```bash
cd backend && npm test
```

## 📸 Screenshots
*(Insert screenshots here)*

## 🎥 Live Demo
*(Insert live demo link / video here)*

---
<<<<<<< HEAD
*Built for Gen AI Academy APAC — "AI for Better Living and Smarter Communities" · Team Infinite Parallax*
=======
*Built for the Google Cloud Hackathon*
>>>>>>> 664f51643a605ba6b1964350c6ae99e3434476d3
