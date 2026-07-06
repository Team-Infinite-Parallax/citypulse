# CityPulse — Hackathon Technical Audit
Repo: `Team-Infinite-Parallax/citypulse` (branch: `main`, inspected via full source checkout)

---

## 1. Project Goal

CityPulse is a **traffic congestion monitoring and Q&A dashboard for a single city (Bengaluru — coords hardcoded to 12.98°N, 77.62°E)**. It covers 5 fixed corridors (MG Road, Ring Road, Airport Expressway, Tech Park Avenue, Station Road) with:
- A live map colored by congestion
- KPI cards + trend charts
- An anomaly/alerts feed
- A natural-language "Ask the city" box backed by Gemini
- Auto-generated one-line recommendations for congested routes

**Relevance to the challenge:** Yes, but narrowly. It sits squarely in "Urban Mobility and Transportation," one solution area out of twelve listed. It does **not** attempt cross-domain decision intelligence (public safety, healthcare, energy, waste, citizen services, etc.) — it's a single-vertical dashboard, not a platform. The problem statement asks for a "Decision Intelligence Platform" spanning multiple community data sources; this repo is a scoped traffic app.

---

## 2. Architecture

| Layer | What's actually there |
|---|---|
| Frontend | Astro + React islands, Tailwind v4, Zustand for state, Recharts for charts, `react-map-gl`/MapLibre for the map |
| Backend | Express.js (Node), 3 route files (`traffic.js`, `query.js`, `forecast.js`) |
| Database | **None.** Data is a static `backend/data/traffic.json` (124KB) written once by a script |
| APIs | REST endpoints (`/api/traffic`, `/api/traffic/summary`, `/api/query`, `/api/alerts`, `/api/recommendations`) |
| AI Components | Single `backend/lib/gemini.js` wrapper calling `@google/genai` with `gemini-flash-latest` |
| Authentication | **Not found in repository.** No auth middleware, no user model, no sessions |
| Deployment | **Not found in repository.** No Dockerfile, no `cloudbuild.yaml`, no Cloud Run service config. Frontend calls `http://localhost:3001` hardcoded directly in three components (`Dashboard.jsx`, `MapView.jsx`, `QueryBar.jsx`) — this will break in any deployed environment |

---

## 3. AI Feature Checklist

| Feature | Status | Evidence |
|---|---|---|
| LLM integration | ✅ Implemented | `backend/lib/gemini.js` calls `@google/genai` |
| Gemini API | ✅ Implemented | Model string `gemini-flash-latest` |
| Vertex AI | ❌ Missing | No `@google-cloud/vertexai` or Vertex SDK anywhere in either `package.json` |
| RAG | ⚠️ Partially implemented | `query.js` does **keyword string-matching** against a hardcoded list (`["mg road","ring road",...,"incident","worst","highest"]`) to select a JSON slice, then stuffs it into the prompt. This is manual context-filtering, not retrieval — no embeddings, no vector index, no semantic similarity |
| Vector Database | ❌ Missing | Not found in repository |
| Embeddings | ❌ Missing | Not found in repository |
| Semantic Search | ❌ Missing | Keyword `.includes()` matching only (see `query.js` lines 57-64) |
| AI Agents / ADK | ❌ Missing | No Agent Development Kit usage, no multi-step agent/tool-calling loop |
| NLP | ⚠️ Partially implemented | Only via the Gemini call itself; no local NLP (no intent classification, entity extraction) |
| Machine Learning | ❌ Missing | No trained model, no scikit-learn/TF/PyTorch, no `.pkl`/`.h5` artifacts |
| Computer Vision | ❌ Missing | Not found in repository |
| Forecasting | ❌ Missing | `forecast.js` does **not forecast** — it computes historical peak-hour averages and flags routes >70% congestion, then asks Gemini for a one-line text suggestion. There is no time-series prediction (no ARIMA, Prophet, LSTM, or Vertex Forecasting) despite the file being named `forecast.js` |
| Recommendation System | ⚠️ Partially implemented | Rule-triggered (avg congestion > 70) + single LLM call for the wording. Not a learned recommender |

---

## 4. Challenge Alignment Table

| Requirement | Repository Feature | Status | Score /10 |
|---|---|---|---|
| AI-powered decision support | Gemini-generated recommendation strings | ⚠️ Partial | 5 |
| Natural language interface | `/api/query` + `QueryBar.jsx` chat box | ✅ Present | 7 |
| Data analytics | Averages, peak-hour, summary stats | ⚠️ Basic | 4 |
| Pattern detection | Threshold rule (congestion > 90 or "incident" in notes) | ⚠️ Rule-based, not learned | 3 |
| Prediction / forecasting | None — mislabeled route name only | ❌ Missing | 1 |
| Automation / workflow | None — no scheduled jobs, no Cloud Scheduler, no pipelines | ❌ Missing | 1 |
| Community impact | Single traffic use case, synthetic data, one city | ⚠️ Narrow | 4 |
| Scalability | No DB, no queue, no containerization, no cloud deploy | ❌ Missing | 2 |
| Innovation | UI is polished; underlying AI is a single prompt-and-display loop | ⚠️ Partial | 4 |
| Google Cloud usage | Only a Gemini API key via `@google/genai` — this is the direct Gemini Developer API, not a Google Cloud service (no GCP project, no Vertex, no Cloud Run) | ❌ Effectively missing | 1 |

**Average: ~3.2/10** — the UI/UX is genuinely good, but the "Decision Intelligence Platform on Google Cloud" ask is largely unmet.

---

## 5. Google Cloud Service Audit

| Service | Status |
|---|---|
| Gemini API | ⚠️ Used, but via the standalone **Gemini Developer API** (`@google/genai` with an API key), not Vertex AI's Gemini endpoint. Judges scoring "Google Cloud usage" specifically may not credit this the same way |
| Vertex AI | ❌ Not found |
| Cloud Run | ❌ Not found — no Dockerfile, no service YAML |
| BigQuery | ❌ Not found — data is a static JSON file |
| Firestore | ❌ Not found |
| Cloud SQL | ❌ Not found |
| Cloud Functions | ❌ Not found |
| AlloyDB | ❌ Not found |
| Looker | ❌ Not found |
| ADK | ❌ Not found |
| Cloud Storage | ❌ Not found — traffic.json lives in the repo, not a bucket |
| Pub/Sub | ❌ Not found |
| Cloud Scheduler | ❌ Not found |

**Bottom line: of 13 listed GCP services, 0 are genuinely integrated.** The only AI dependency is a Gemini API key, callable from anywhere — this is currently a **Google Cloud hackathon submission with no verifiable Google Cloud infrastructure**.

---

## 6. Code Quality Review

| Dimension | Score /10 | Notes |
|---|---|---|
| Folder structure | 7 | Clean monorepo split (`frontend/`, `backend/`), sensible route/lib separation |
| Code modularity | 6 | Routes and Gemini calls are cleanly separated; but no service/repository layer, business logic lives directly in route handlers |
| Scalability | 2 | Flat-file "database," synchronous `fs.readFileSync` on every request, no caching, no pagination |
| Security | 3 | `cors()` wide open with no origin restriction; API key handling via `.env` is fine, but no rate limiting, no input validation/sanitization on `/api/query`, no auth on any endpoint |
| API design | 6 | RESTful, sensible route naming, reasonable JSON shapes |
| Error handling | 6 | Try/catch present with graceful fallback JSON on Gemini failure (`query.js` lines 87-95) — better than most hackathon code |
| Documentation | 1 | README is the **unedited default Astro starter template** — doesn't mention CityPulse, the problem it solves, setup instructions, or architecture at all |
| Environment variables | 5 | `.env.example` exists with `GEMINI_API_KEY`, but frontend has zero env vars — API base URL is hardcoded to `localhost:3001` in three files, so it cannot point at a deployed backend without code edits |
| Production readiness | 2 | No build/deploy config, no health-check wiring beyond a basic `/api/health` route, no logging/observability |

---

## 7. Feature Mapping

**Feature: Live congestion map (MapView.jsx)**
Supports: ✔ Urban Mobility · ✔ Data Visualization

**Feature: KPI dashboard + trend charts (Dashboard.jsx)**
Supports: ✔ Data Analytics · ✔ Decision Support (weakly)

**Feature: Anomaly/alerts feed (AlertsPanel.jsx, `/api/alerts`)**
Supports: ✔ Pattern Detection (rule-based only)

**Feature: "Ask the city" chatbot (QueryBar.jsx, `/api/query`)**
Supports: ✔ Natural Language Interface · ✔ AI Assistant

**Feature: Auto-recommendations (`/api/recommendations`)**
Supports: ✔ AI-Powered Recommendations (partially — templated + one LLM call)

---

## 8. Missing Features (Prioritized)

**Critical**
- No real Google Cloud service integration (Vertex AI, BigQuery, Cloud Run, AlloyDB) — this is the single biggest risk given the problem statement explicitly names these
- No real forecasting/predictive model — `forecast.js` doesn't forecast
- No real data source — 100% synthetic, randomly generated JSON, single city, 5 routes, 7 days
- No deployment (no live URL, no Dockerfile/Cloud Run manifest) — judges typically need to click a live demo

**High**
- No RAG/vector search — current "RAG" is keyword `.includes()` matching, easy to expose as a gap under questioning
- Hardcoded `localhost:3001` in three frontend files — breaks any deployed demo unless fixed
- README is the default Astro template — first impression for judges is that the project wasn't finished/described
- No authentication/authorization anywhere

**Medium**
- Single-domain scope (traffic only) vs. multi-domain "Decision Intelligence Platform" framing in the brief
- No automation/workflow layer (Cloud Scheduler, Pub/Sub, scheduled jobs)
- No CORS restriction, no input validation on the query endpoint

**Low**
- No tests found in repository
- No CI/CD config found in repository

---

## 9. Improvement Suggestions (achievable in hackathon time)

**AI improvements**
- Swap the direct Gemini Developer API for **Vertex AI's Gemini endpoint** (same model, different SDK/auth path) — this alone satisfies "uses Vertex AI" for judging purposes and is a low-effort swap given the abstraction already exists in `gemini.js`
- Replace keyword matching in `query.js` with real embeddings + a lightweight vector store (even an in-memory cosine-similarity search over chunked traffic summaries) to legitimately claim RAG
- Add an actual time-series forecast (even a simple linear/seasonal-naive model, or Vertex AI Forecasting) so `forecast.js` matches its name

**Google Cloud integration**
- Move `traffic.json` into **BigQuery** and query it from the backend — turns "static file" into "data analytics platform," directly addressing the biggest missing checkbox
- Containerize and deploy the backend on **Cloud Run** (a few hours of work: Dockerfile + `gcloud run deploy`), replace hardcoded `localhost:3001` with an env-driven `VITE_API_URL`
- Store the API key in **Secret Manager** rather than `.env` if deploying

**UI/UX**
- Already the strongest part of the project — dark "night dispatch" theme, KPI cards, and map are polished and demo-well

**Architecture**
- Add a real database (Cloud SQL/AlloyDB or even SQLite for MVP) instead of `fs.readFileSync` per request
- Extract a shared API client/config instead of hardcoding the base URL three times

**Performance**
- Cache `/api/traffic/summary` computation instead of recomputing from the full JSON on every request

---

## 10. Hackathon Judging Score (out of 100)

| Category | Max | Score | Justification |
|---|---|---|---|
| Innovation | 20 | 8 | Polished traffic dashboard concept, but a well-trodden hackathon pattern (map + chatbot + charts) |
| Technical Complexity | 20 | 7 | Clean full-stack app, but no ML, no vector search, no real data pipeline |
| AI Usage | 20 | 6 | Real Gemini calls with graceful fallback, but "RAG" is keyword matching and "forecast" doesn't forecast |
| Google Cloud Usage | 15 | 1 | Only a Gemini API key; zero verified GCP services (Vertex/BigQuery/Cloud Run/AlloyDB/ADK all absent) |
| Scalability | 10 | 2 | Flat-file storage, no containerization, no deployment target |
| UI/UX | 5 | 4 | Genuinely good visual design and interaction quality |
| Presentation Readiness | 5 | 1 | README is the unedited Astro starter — nothing describing the project itself |
| Real-world Impact | 5 | 2 | Fully synthetic data, single city, narrow scope |

**Total: ~31/100**

---

## 11. Final Verdict

🟠 **Partially Aligned**

The core concept (AI-assisted urban mobility dashboard with an NL query interface) fits the theme's "Urban Mobility" solution area and demonstrates a working, well-designed app. But against the specific rubric in the problem statement — decision intelligence *across* community domains, real predictive analytics, and **Google Cloud ecosystem usage** — this repo currently falls short on nearly every named technology (Vertex AI, BigQuery, Cloud Run, AlloyDB, ADK, Looker: all absent), has no live deployment, no real data, and a placeholder README. It would read to a judge as an early-stage MVP, not a finished submission.

---

## 12. Action Plan

**Must do before submission**
- [ ] Rewrite `README.md` — problem, architecture diagram, tech stack, setup, screenshots
- [ ] Deploy backend to Cloud Run + fix hardcoded `localhost:3001` in frontend
- [ ] Move at least one component to a real GCP service (Vertex AI Gemini endpoint is the fastest win)
- [ ] Add a live demo link/video

**Should do if time permits**
- [ ] Move data into BigQuery, query it live
- [ ] Add a real (even simple) forecasting model
- [ ] Implement genuine RAG with embeddings instead of keyword matching

**Optional enhancements**
- [ ] Expand beyond traffic into a second domain (e.g., waste or energy) to better match "platform" framing
- [ ] Add basic auth and rate limiting
- [ ] Add tests and a CI pipeline

---

## 13. Winning Potential

**Would this reach the finals as-is? Unlikely.** Google Cloud hackathon judges typically weight "Google Cloud Usage" heavily and specifically check for named services in the tech stack — this submission currently scores near-zero there despite being framed as a Google Cloud x H2S track entry. Combine that with the unedited README and no live deployment, and it reads as unfinished to a judge doing a quick pass.

**What would make it finalist-level:**
1. Real Vertex AI usage (not just a Gemini API key) — even a one-line SDK swap
2. At least one more named GCP service wired in and demonstrably used (BigQuery for the data layer is the most natural fit given the existing JSON structure)
3. A deployed, working demo URL (Cloud Run)
4. A rewritten README that actually describes CityPulse
5. Either a real forecasting component or an honest rename/reframe of `forecast.js` to avoid over-claiming

The frontend and product instinct here are good — this is a fixable gap, not a fundamentally weak idea, but as it stands the repo would not clear a Google Cloud-technology screening pass.
