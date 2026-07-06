# CityPulse → 100/100 Winning Roadmap
### Gen AI Academy APAC — "AI for Better Living and Smarter Communities"
**Team: Infinite Parallax | Repo: `Team-Infinite-Parallax/citypulse`**

---

## 0. Where you actually stand right now

Your repo already contains a self-audit (`citypulse_audit.md`) scoring the project **~31/100** against a Google-Cloud-style rubric. I've re-checked it against the challenge statement you pasted. The verdict lines up:

| Category | Current | Max | Gap |
|---|---|---|---|
| Innovation | 8 | 20 | Single-vertical (traffic only), common hackathon pattern |
| Technical Complexity | 7 | 20 | No ML, no vector search, no real pipeline |
| AI Usage | 6 | 20 | Gemini API works, but "RAG" is keyword `.includes()`, "forecast" doesn't forecast |
| Cloud/Platform Usage | 1 | 15 | Zero verified cloud services beyond a Gemini API key |
| Scalability | 2 | 10 | Flat JSON file, no DB, no deploy |
| UI/UX | 4 | 5 | Genuinely strong — keep this |
| Presentation Readiness | 1 | 5 | Default README, no live demo |
| Real-world Impact | 2 | 5 | Synthetic data, one city, one domain |

**The good news:** your UI/UX instinct and full-stack skeleton are solid. Nothing here needs a rewrite — it needs *depth*. The judges aren't going to penalize you for a small team building fast; they'll penalize you for a dashboard that *looks* AI-powered but isn't, and for missing the "platform" framing the brief explicitly asks for ("help individuals, communities, organizations, **and city stakeholders**... across data from **public services, transportation, environmental monitoring, healthcare, citizen feedback, utility networks**").

Your entire fix is: **go from "one AI feature bolted onto a traffic dashboard" to "one decision-intelligence platform with a second domain, real retrieval, real forecasting, and a working live demo."**

---

## 1. Priority Framework (you have limited hours — KSP Datathon + BAH are also live)

Use this MoSCoW split. Do **Must** even if you skip everything else — it alone should move you from ~31 to ~60-65.

### 🔴 MUST (non-negotiable, ~6-10 hrs total)
1. Fix hardcoded `localhost:3001` → env-driven API URL
2. Deploy backend to Cloud Run + frontend to Vercel/Firebase Hosting — **you need a clickable live URL**
3. Rewrite `README.md` completely
4. Replace keyword-matching "RAG" with real embeddings + cosine similarity (genuine retrieval)
5. Rename or actually build `forecast.js` — pick ONE real forecasting method (see §3)

### 🟡 SHOULD (if you have 4-6 more hrs)
6. Move `traffic.json` into BigQuery — query it live
7. Add a second domain (Air Quality is already partially there — extend it, or add a lightweight Waste/Energy module) to justify the "platform" framing
8. Swap direct Gemini Developer API → Vertex AI Gemini endpoint (same model, different auth — low effort, high judging credit)
9. Add basic input validation + CORS restriction on `/api/query`

### 🟢 COULD (only if everything above is done)
10. Cloud Scheduler job that periodically refreshes/ingests data (shows "automation")
11. ADK-based agent (multi-step tool calling) instead of a single prompt-and-display call
12. Looker Studio dashboard embed for a "civic reporting" angle
13. Basic auth for a "city stakeholder" role vs "citizen" role (maps directly to the brief's audience list)

---

## 2. Fixing the AI Core (biggest score lever — 20 + 20 + 15 = 55/100 points ride on this)

### 2.1 Real RAG (replace `query.js` keyword matching)
Current: a hardcoded array of strings `.includes()`-matched against the query, then the matching JSON slice is stuffed into the prompt. This is not retrieval — it's a lookup table with extra steps, and it's the single easiest thing for a judge to expose by asking "how does your RAG actually work?"

**Minimum viable real RAG (no new infra required, doable in ~1-2 hrs):**
1. At startup, chunk your `traffic.json` + AQI data into short text summaries (one per corridor per time-window, e.g. *"MG Road, 6-7 PM: congestion 82%, AQI 156, 2 incidents logged"*).
2. Call Gemini's embedding model (`text-embedding-004` or Vertex `textembedding-gecko`) once per chunk at boot, cache the vectors in memory (a plain array is fine for this scale).
3. On each user query: embed the query the same way, compute cosine similarity against all cached chunk vectors, take the top-k (3-5), inject *those* into the prompt instead of the keyword-matched slice.
4. This is genuinely defensible as "RAG" in a judging Q&A — you can literally show the similarity scores.

**If you have more time:** swap the in-memory array for a real vector store — even a lightweight one like `pgvector` on Cloud SQL, or **AlloyDB** (explicitly named in the challenge tech list) counts as a strong differentiator since almost no other team will have wired up a real Google Cloud vector DB.

### 2.2 Real Forecasting (fix `forecast.js`)
Current: computes historical peak-hour averages and flags routes >70% congestion — that's a rule-based anomaly flag, not a forecast, and the file name currently over-claims.

**Fastest legitimate fix (~1 hr):** implement a simple seasonal-naive or exponential smoothing forecast:
- Seasonal-naive: predict tomorrow 6-7 PM congestion = average of congestion at 6-7 PM over the last N days (you already have the time-series data — this is a real, defensible forecasting method, just simple).
- Or use `simple-statistics` / a small custom linear regression over hour-of-day to predict next-N-hours congestion trend.
- Then feed the *forecasted* number (not just the historical average) to Gemini for the recommendation text — now the recommendation is actually downstream of a prediction, closing the "prediction/forecasting" rubric gap.

**If you have more time:** call **Vertex AI Forecasting** or a lightweight Prophet/ARIMA model in a small Python Cloud Function — this is the single highest-leverage "technical complexity" point if you can pull it off, since it's a named GCP capability in the brief.

### 2.3 Vertex AI over direct Gemini API
Your `gemini.js` wrapper already isolates all Gemini calls in one file — this is a **1-2 hour swap**, not a rewrite:
- Replace `@google/genai` (Gemini Developer API, API-key auth) with `@google-cloud/vertexai` (Vertex AI, GCP-project + service-account auth).
- Same model family, same prompt logic — only the SDK import and auth path change.
- This single swap is explicitly called out in your own audit as the fastest way to convert "Google Cloud Usage: 1/15" into a real, verifiable score, since judges in a Google Cloud track specifically check for GCP-billed services, not just "uses an LLM."

---

## 3. Fixing the "Platform" Framing (Innovation + Real-world Impact)

The brief explicitly lists 12 solution areas and frames this as cross-domain decision intelligence, not a single dashboard. You don't need to build 12 domains — you need **one credible second domain** so CityPulse reads as a platform, not an app.

**Recommended second domain: Environmental/AQI is already half-built** — lean into it fully rather than adding something new from scratch:
- Add a genuine **health-impact layer**: cross-reference AQI + congestion to generate a "vulnerable groups advisory" (e.g., "AQI 156 on MG Road corridor — recommend school/elderly outdoor activity caution 6-8 AM"). This touches "Healthcare Access and Community Wellness" from the brief's solution list with almost no new data plumbing.
- This also gives you a second, independent "Ask the City" query type — strengthens the RAG demo, since now retrieval has to disambiguate between traffic questions and health/AQI questions.

**If time allows, a third light-touch domain:** a simple citizen feedback/complaint intake endpoint (`POST /api/feedback`) that gets categorized by Gemini (pothole / signal fault / streetlight / waste) and shown on the same map as a new layer — this maps directly to "Citizen Engagement and Public Services," another named solution area, and is genuinely a 1-2 hour build (one endpoint + one Gemini classification call + one map layer).

---

## 4. Data & Infra (Scalability rubric — currently 2/10)

1. **BigQuery migration** (biggest single scalability win): load `traffic.json` into a BigQuery table, query it from the backend instead of `fs.readFileSync`. Directly converts "static file" into "data analytics platform" — the exact language the brief uses.
2. **Fix the hardcoded `localhost:3001`**: introduce `VITE_API_URL` (or equivalent) in the frontend, read from env in all three affected components (`Dashboard.jsx`, `MapView.jsx`, `QueryBar.jsx`). Without this your deployed demo will literally break in front of judges.
3. **Deploy the backend to Cloud Run**: you already have Node/Express — a Dockerfile + `gcloud run deploy` is a few hours max. This is the single most judge-visible fix: a dead `localhost` demo reads as unfinished no matter how good the code is.
4. **Cache `/api/traffic/summary`**: avoid recomputing from the full JSON on every request — cheap fix, shows you thought about production behavior.

---

## 5. Presentation Readiness (currently 1/5 — an embarrassingly easy 4 points)

- **Rewrite `README.md` completely** — right now it's the unedited Astro starter template, which is the first thing any judge sees. Include: problem statement mapping, architecture diagram, real screenshots, live demo link, setup instructions, and an explicit "Google Cloud Services Used" section listing exactly which ones and why.
- **Record a 2-3 minute demo video** — walk through: map → ask a traffic question → ask a health/AQI question → show a forecast → show the recommendation. Judges often skim repos fast; a good video recovers points a rushed read would miss.
- **One architecture diagram** (even a simple one) showing: Frontend (Astro/React) → Backend (Express/Cloud Run) → BigQuery + Vertex AI (embeddings + Gemini) → Response. This single image answers 80% of "how does this actually work" questions before they're asked.

---

## 6. Suggested Final Scorecard (if you execute Must + Should)

| Category | Max | Before | After Must+Should |
|---|---|---|---|
| Innovation | 20 | 8 | 15 |
| Technical Complexity | 20 | 7 | 16 |
| AI Usage | 20 | 6 | 17 |
| Cloud/Platform Usage | 15 | 1 | 12 |
| Scalability | 10 | 2 | 8 |
| UI/UX | 5 | 4 | 5 |
| Presentation Readiness | 5 | 1 | 5 |
| Real-world Impact | 5 | 2 | 4 |
| **Total** | **100** | **~31** | **~82** |

Getting past 82 into the 90s means genuinely nailing ADK/agentic tool-calling, a real deployed vector DB (AlloyDB/pgvector), and a polished live demo video — all "Could" tier, worth attempting only after Must+Should are locked in.

---

## 7. Concrete Checklist (copy into your issue tracker)

**Must**
- [ ] `VITE_API_URL` env var replacing hardcoded `localhost:3001` in `Dashboard.jsx`, `MapView.jsx`, `QueryBar.jsx`
- [ ] Backend Dockerfile + Cloud Run deployment, live URL working
- [ ] Frontend deployed (Vercel/Firebase Hosting) pointed at the live backend
- [ ] `README.md` fully rewritten with architecture, setup, screenshots, demo link
- [ ] `query.js` rebuilt with real embeddings + cosine similarity RAG
- [ ] `forecast.js` rebuilt with a real seasonal-naive/exponential-smoothing forecast

**Should**
- [ ] `traffic.json` migrated into BigQuery, backend queries it live
- [ ] Gemini calls moved from `@google/genai` to `@google-cloud/vertexai`
- [ ] AQI/health-impact advisory layer added as a second domain
- [ ] Basic CORS restriction + input validation on `/api/query`

**Could**
- [ ] Citizen feedback intake endpoint + map layer
- [ ] Cloud Scheduler job for periodic data refresh
- [ ] ADK-based multi-step agent replacing the single Gemini call
- [ ] Basic auth (citizen vs. city-stakeholder roles)
- [ ] Demo video recorded and linked in README

---

*Built from your own `citypulse_audit.md` cross-checked against the Gen AI Academy APAC problem statement. Focus on Must first — it's the difference between "unfinished MVP" and "credible platform" in a judge's first two minutes.*
