# CityPulse

**AI-powered Decision Intelligence Platform for Better Living and Smarter Communities**

Built for **Gen AI Academy APAC**
Team: **Infinite Parallax**

---

## Problem Statement

> Build an AI-powered Decision Intelligence Platform that leverages data, AI models, and intelligent automation to help individuals, communities, organizations, and city stakeholders analyze information, generate insights, predict outcomes, and make better decisions that improve everyday life and community well-being.

CityPulse directly addresses this challenge by integrating **10 of 12 suggested solution areas** into a single unified platform with conversational AI, predictive analytics, multimodal understanding, and automated decision workflows — all powered by Google Cloud's AI ecosystem.

## Solution Areas Covered

| Solution Area | CityPulse Implementation |
|---|---|
| **Urban mobility & transportation** | Live congestion map, delay tracking, peak-hour analysis, Holt-Winters forecasting with uncertainty bands |
| **Public safety & emergency preparedness** | Incident intelligence layer, anomaly detection on incident rates, disaster preparedness agentic planning |
| **Healthcare access & community wellness** | Health-advisory engine cross-referencing AQI × congestion, vulnerable-group alerts, AQI-based risk assessment |
| **Environmental sustainability** | AQI tracking, waste management efficiency, water quality index, composite ward livability scores |
| **Waste management & resource optimization** | Ward-level waste collection efficiency, AI-simulated policy impact ("what if waste improves by 20%?") |
| **Energy efficiency & smart utilities** | Per-ward energy consumption, solar adoption rates, green energy %, water distribution loss tracking |
| **Citizen engagement & public services** | Citizen reporting with Gemini Vision photo classification, real-time map overlay of citizen reports |
| **Accessibility & inclusive communities** | Citizen view mode, high-contrast accessibility mode, lite mode for low-bandwidth, role-based UI toggles |
| **Disaster response & recovery** | Agentic planning workflow identifying priority wards, incident-rate spike detection, auto-drafted action memos |
| **Tourism & local economic development** | Points of interest map, footfall analytics, event calendar, AI economic impact assessments |
| *Education & lifelong learning* | *(future)* — Community skills directory, learning event integration |
| *Community support & social impact* | *(future)* — Volunteer coordination, social service referrals |

## Technology Stack

### Google Cloud Services

| Service | Role |
|---|---|
| **Vertex AI (Gemini 1.5 Flash)** | Natural-language Q&A, RAG answer generation, recommendation engine, Vision (photo classification), structured JSON generation |
| **Vertex AI Embeddings (text-embedding-004)** | Cross-domain vector embeddings for semantic retrieval |
| **BigQuery** | Live OLAP queries on traffic, environment, and incident data |
| **Firestore** | Persistent storage for citizen reports and action memos (transactional writes) |
| **AlloyDB / pgvector** | Production vector store for RAG retrieval (OLTP + vector search) |
| **Cloud Run** | Containerized backend deployment |
| **Cloud Build** | CI/CD pipeline (GitHub Actions → Cloud Build) |
| **Looker Studio** *(integrated)* | Embedded city-official summary report |

### Frontend Stack
Astro 7, React 19, Tailwind CSS 4, Zustand, MapLibre GL, Recharts, Lucide Icons

## Architecture

```
Citizen / Planner ──→ Frontend (Astro + React Islands)
                           │ REST API
                           ▼
                     Express.js Backend (Cloud Run)
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         BigQuery     Vertex AI     Firestore
         (OLAP)      (Gemini +      (OLTP)
                      Embeddings)
                           │
                     AlloyDB/pgvector
                     (Vector Store)
```

## Key Features

### 1. Conversational AI — "Ask the City"
Multi-domain RAG query engine that retrieves context from **mobility, public safety, environment, tourism, and energy** data. Supports voice input (Web Speech API) and returns grounded answers with explainability panels showing confidence, sources, and reasoning.

### 2. Predictive Analytics
- **Holt-Winters forecasting** with 90% prediction intervals for congestion trends
- **Learned autoregression** (OLS with seasonal features) as an ensemble model
- Confidence bands visualized as shaded uncertainty areas on trend charts

### 3. AI Agentic Workflows (ADK Pattern)
Multi-step planning agents that orchestrate cross-domain tool calls:
- **Ideal Commute Planner** — finds best corridors combining congestion + AQI data
- **Disaster Preparedness** — identifies priority wards for emergency resources
- **Impact Simulation** — simulates waste-collection improvement effects on AQI
- **Tourism Hotspot Ranking** — scores POIs by economic potential + accessibility

### 4. Anomaly Detection
Shared rolling-baseline z-score engine across all domains:
- Traffic congestion spikes vs corridor-level baseline
- Public safety incident rate spikes vs ward-level baseline
- Severity scoring (z-score → CRITICAL/HIGH/WARNING/INFO)

### 5. Decision Intelligence Loop
- Anomaly → auto-drafted Action Memo (Gemini-generated)
- Draft → human approves → status changes to Dispatched
- Citizen photo report → Gemini Vision classifies → appears on map

### 6. Multimodal Understanding
- **Voice** → Web Speech API → text query → same RAG pipeline
- **Photo** → Gemini Vision classifies pothole/garbage/waterlogging/streetlight

### 7. Explainable & Responsible AI
- Every AI output has an expandable "Why?" panel with:
  - Confidence score and label (high/medium/low)
  - Top-k retrieved sources with similarity scores
  - Plain-language rationale from Gemini
  - Detection/retrieval method
- Full `RESPONSIBLE_AI.md` covering data provenance, model limitations, human-in-the-loop requirements

## Project Structure

```
citypulse/
├── frontend/              # Astro + React dashboard
│   └── src/
│       ├── components/    # React islands (MapView, QueryBar, Dashboard, etc.)
│       ├── store/         # Zustand global state
│       ├── layouts/       # Astro layout with role-based view toggle
│       ├── pages/         # Astro pages
│       └── styles/        # Global CSS with accessibility modes
├── backend/               # Express.js API
│   ├── routes/            # API route handlers (8 domain modules)
│   ├── lib/               # Core libraries (Gemini, forecast, anomaly, vector store)
│   ├── data/              # JSON data files (incidents, environment)
│   ├── scripts/           # Data generation / BigQuery init scripts
│   └── tests/             # Jest test suite
├── graphify-out/          # Project knowledge graph (dev tooling)
├── RESPONSIBLE_AI.md      # Responsible AI disclosure
└── README.md
```

## Local Setup

```bash
# 1. Install dependencies
cd frontend && npm install && cd ../backend && npm install

# 2. Authenticate with Google Cloud
gcloud auth application-default login

# 3. Configure environment (backend/.env)
#    GCP_PROJECT_ID=citypulse-501614

# 4. Run both servers
cd backend && npm run dev    # Express on :3001
cd ../frontend && npm run dev  # Astro on :4321
```

## Deployment

- **Backend:** Render (blueprint) or Cloud Run
- **Frontend:** Vercel (Astro + Vercel adapter)
- See deployment section in full README for detailed steps

## Team — Infinite Parallax

*Built for Gen AI Academy APAC — "AI for Better Living and Smarter Communities"*
