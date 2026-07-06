# Graph Report - citypulse  (2026-07-06)

## Corpus Check
- 40 files · ~25,854 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 190 nodes · 217 edges · 19 communities (17 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5dbe5cf9`
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

## God Nodes (most connected - your core abstractions)
1. `CityPulse → 100/100 Winning Roadmap` - 10 edges
2. `CityPulse 🏙️` - 9 edges
3. `getTrafficData()` - 7 edges
4. `useCityStore` - 7 edges
5. `embedTexts()` - 6 edges
6. `scripts` - 5 edges
7. `scripts` - 5 edges
8. `scripts` - 4 edges
9. `getIndex()` - 4 edges
10. `Web Interface Guidelines` - 4 edges

## Surprising Connections (you probably didn't know these)
- `MapView()` --calls--> `useCityStore`  [EXTRACTED]
  frontend/src/components/MapView.jsx → frontend/src/store/useCityStore.js
- `QueryBar()` --calls--> `useCityStore`  [EXTRACTED]
  frontend/src/components/QueryBar.jsx → frontend/src/store/useCityStore.js
- `initBQ()` --references--> `bigquery`  [EXTRACTED]
  backend/scripts/init_bq.js → backend/lib/db.js
- `getIndex()` --calls--> `getTrafficData()`  [EXTRACTED]
  backend/routes/query.js → backend/lib/db.js
- `getIndex()` --calls--> `embedTexts()`  [EXTRACTED]
  backend/routes/query.js → backend/lib/gemini.js

## Import Cycles
- None detected.

## Communities (19 total, 2 thin omitted)

### Community 0 - "Backend API & Server"
Cohesion: 0.16
Nodes (11): DATA_FILE, __dirname, __filename, generateRecommendation(), router, router, router, router (+3 more)

### Community 1 - "Frontend React Components"
Cohesion: 0.11
Nodes (16): ../components/AlertsPanel.jsx, ../components/Dashboard.jsx, ../components/HealthAdvisory.jsx, ../components/MapView.jsx, ../components/QueryBar.jsx, ../components/RecommendationCard.jsx, ../styles/global.css, Dashboard() (+8 more)

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
Cohesion: 0.12
Nodes (16): 0. Where you actually stand right now, 1. Priority Framework (you have limited hours — KSP Datathon + BAH are also live), 2.1 Real RAG (replace `query.js` keyword matching), 2.2 Real Forecasting (fix `forecast.js`), 2.3 Vertex AI over direct Gemini API, 2. Fixing the AI Core (biggest score lever — 20 + 20 + 15 = 55/100 points ride on this), 3. Fixing the "Platform" Framing (Innovation + Real-world Impact), 4. Data & Infra (Scalability rubric — currently 2/10) (+8 more)

### Community 10 - "gemini.js"
Cohesion: 0.23
Nodes (13): getTrafficData(), cosineSimilarity(), embedCache, embeddingMode(), embedTexts(), generateEmbeddings(), generateQueryResponse(), getAuthClient() (+5 more)

### Community 11 - "CityPulse 🏙️"
Cohesion: 0.20
Nodes (9): 🏗 Architecture, CityPulse 🏙️, 🚀 Features, ☁️ Google Cloud Services Used, 🎥 Live Demo, 🚦 Local Setup, 📸 Screenshots, 🛠️ Tech Stack (+1 more)

### Community 12 - "init_bq.js"
Cohesion: 0.33
Nodes (5): bigquery, DATA_FILE, __dirname, __filename, initBQ()

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

## Knowledge Gaps
- **107 isolated node(s):** `__filename`, `__dirname`, `DATA_FILE`, `useVertex`, `embedCache` (+102 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Frontend App Assets` to `Frontend Config`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `bigquery` connect `init_bq.js` to `Backend API & Server`, `gemini.js`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `DATA_FILE` to the rest of the system?**
  _107 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend React Components` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._
- **Should `Frontend App Assets` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `Backend Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Frontend Config` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._