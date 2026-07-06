# Graph Report - citypulse  (2026-07-06)

## Corpus Check
- 57 files · ~35,701 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 292 nodes · 356 edges · 23 communities (21 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1b697b62`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Backend API & Server|Backend API & Server]]
- [[_COMMUNITY_Frontend React Components|Frontend React Components]]
- [[_COMMUNITY_Frontend App Assets|Frontend App Assets]]
- [[_COMMUNITY_Backend Config|Backend Config]]
- [[_COMMUNITY_Frontend Config|Frontend Config]]
- [[_COMMUNITY_Root Workspace Config|Root Workspace Config]]
- [[_COMMUNITY_Frontend Build Config|Frontend Build Config]]
- [[_COMMUNITY_Backend Utility Scripts|Backend Utility Scripts]]
- [[_COMMUNITY_CityPulse → 100100 Winning Roadmap|CityPulse → 100/100 Winning Roadmap]]
- [[_COMMUNITY_gemini.js|gemini.js]]
- [[_COMMUNITY_CityPulse 🏙️|CityPulse 🏙️]]
- [[_COMMUNITY_init_bq.js|init_bq.js]]
- [[_COMMUNITY_Web Interface Guidelines|Web Interface Guidelines]]
- [[_COMMUNITY_Web Interface Guidelines|Web Interface Guidelines]]
- [[_COMMUNITY_AGENTS|AGENTS.md]]
- [[_COMMUNITY_CLAUDE|CLAUDE.md]]
- [[_COMMUNITY_graphify|graphify.md]]
- [[_COMMUNITY_graphify|graphify.md]]
- [[_COMMUNITY_actions.js|actions.js]]
- [[_COMMUNITY_generate_incidents.js|generate_incidents.js]]
- [[_COMMUNITY_forecast.js|forecast.js]]
- [[_COMMUNITY_generate_environment.js|generate_environment.js]]

## God Nodes (most connected - your core abstractions)
1. `🏙️ CityPulse` - 13 edges
2. `CityPulse — Implementation Brief for Claude Opus 4.8 / Claude Code` - 9 edges
3. `detectAnomalies()` - 7 edges
4. `detectRateSpikes()` - 7 edges
5. `getTrafficData()` - 7 edges
6. `useCityStore` - 7 edges
7. `🚦 Local Setup` - 7 edges
8. `forecastSeries()` - 6 edges
9. `embedTexts()` - 6 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `getIndex()` --calls--> `getTrafficData()`  [EXTRACTED]
  backend/routes/query.js → backend/lib/db.js
- `MapView()` --calls--> `useCityStore`  [EXTRACTED]
  frontend/src/components/MapView.jsx → frontend/src/store/useCityStore.js
- `QueryBar()` --calls--> `useCityStore`  [EXTRACTED]
  frontend/src/components/QueryBar.jsx → frontend/src/store/useCityStore.js
- `initBQ()` --references--> `bigquery`  [EXTRACTED]
  backend/scripts/init_bq.js → backend/lib/db.js
- `getIndex()` --calls--> `embedTexts()`  [EXTRACTED]
  backend/routes/query.js → backend/lib/gemini.js

## Import Cycles
- None detected.

## Communities (23 total, 2 thin omitted)

### Community 0 - "Backend API & Server"
Cohesion: 0.08
Nodes (22): bigquery, DATA_FILE, __dirname, __filename, getTrafficData(), generateOneLiner(), generateRecommendation(), __dirname (+14 more)

### Community 1 - "Frontend React Components"
Cohesion: 0.07
Nodes (22): ../components/ActionCenter.jsx, ../components/AlertsPanel.jsx, ../components/CitizenReport.jsx, ../components/Dashboard.jsx, ../components/HealthAdvisory.jsx, ../components/MapView.jsx, ../components/QueryBar.jsx, ../components/RecommendationCard.jsx (+14 more)

### Community 2 - "Frontend App Assets"
Cohesion: 0.14
Nodes (12): ../assets/astro.svg, ../assets/background.svg, dependencies, astro, @astrojs/react, lucide-react, maplibre-gl, react (+4 more)

### Community 3 - "Backend Config"
Cohesion: 0.10
Nodes (19): dependencies, cors, dotenv, express, express-rate-limit, @google-cloud/bigquery, @google-cloud/vertexai, description (+11 more)

### Community 4 - "Frontend Config"
Cohesion: 0.12
Nodes (15): devDependencies, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom, engines, node, name (+7 more)

### Community 5 - "Root Workspace Config"
Cohesion: 0.20
Nodes (9): devDependencies, concurrently, name, scripts, dev, dev:backend, dev:frontend, install:all (+1 more)

### Community 6 - "Frontend Build Config"
Cohesion: 0.29
Nodes (6): compilerOptions, jsx, jsxImportSource, exclude, extends, include

### Community 7 - "Backend Utility Scripts"
Cohesion: 0.40
Nodes (4): data, dir, routes, today

### Community 9 - "CityPulse → 100/100 Winning Roadmap"
Cohesion: 0.09
Nodes (22): CityPulse — Implementation Brief for Claude Opus 4.8 / Claude Code, Final self-check before submission (score yourself honestly against this), Phase 0 — Repo orientation (do this first, every session), Phase 1 — Fix the "AI is not real AI" problem (Technical Sophistication, 25 pts), Phase 2 — Fix the "single domain" problem (Alignment, 20 pts + Loop, 20 pts), Phase 3 — Close the loop: add real automation (Decision-Intelligence Loop, 20 pts), Phase 4 — Multimodality & GCP breadth (15 pts), Phase 5 — Role-based views & accessibility (Impact/Demo-ability, 10 pts) (+14 more)

### Community 10 - "gemini.js"
Cohesion: 0.13
Nodes (19): analyzeImage(), cosineSimilarity(), embedCache, embeddingMode(), embedTexts(), generateEmbeddings(), generateQueryResponse(), getAuthClient() (+11 more)

### Community 11 - "CityPulse 🏙️"
Cohesion: 0.08
Nodes (24): 1. Clone the repository, 2. Install dependencies, 3. Authenticate with Google Cloud (required for Vertex AI / BigQuery), 4. Configure environment variables, 5. Run the application, 6. Open the app, 🏗 Architecture, 🏙️ CityPulse (+16 more)

### Community 12 - "init_bq.js"
Cohesion: 0.25
Nodes (11): accessor(), confidenceFromZ(), detectAnomalies(), detectRateSpikes(), mean(), severityFromZ(), std(), __dirname (+3 more)

### Community 13 - "Web Interface Guidelines"
Cohesion: 0.40
Nodes (4): Guidelines Source, How It Works, Usage, Web Interface Guidelines

### Community 14 - "Web Interface Guidelines"
Cohesion: 0.40
Nodes (4): Guidelines Source, How It Works, Usage, Web Interface Guidelines

### Community 15 - "AGENTS.md"
Cohesion: 0.50
Nodes (3): Development, Documentation, graphify

### Community 16 - "CLAUDE.md"
Cohesion: 0.50
Nodes (3): Development, Documentation, graphify

### Community 19 - "actions.js"
Cohesion: 0.31
Nodes (7): generateStructured(), __dirname, __filename, getMemos(), MEMO_FILE, saveMemo(), router

### Community 20 - "generate_incidents.js"
Cohesion: 0.22
Nodes (7): DATA_DIR, __dirname, incidents, SEVERITIES, today, TYPES, wards

### Community 21 - "forecast.js"
Cohesion: 0.46
Nodes (7): fitAdditive(), fitLinear(), forecastSeries(), GRID, mean(), sampleStd(), sse()

### Community 22 - "generate_environment.js"
Cohesion: 0.25
Nodes (6): DATA_DIR, __dirname, PROFILE, rows, today, wards

## Knowledge Gaps
- **156 isolated node(s):** `__filename`, `__dirname`, `DATA_FILE`, `GRID`, `useVertex` (+151 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getTrafficData()` connect `Backend API & Server` to `gemini.js`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `DATA_FILE` to the rest of the system?**
  _156 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Backend API & Server` be split into smaller, more focused modules?**
  _Cohesion score 0.08403361344537816 - nodes in this community are weakly interconnected._
- **Should `Frontend React Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._
- **Should `Frontend App Assets` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `Backend Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Frontend Config` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._