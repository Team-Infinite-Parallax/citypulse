# Graph Report - citypulse  (2026-07-07)

## Corpus Check
- 85 files · ~164,618 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 428 nodes · 601 edges · 42 communities (38 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `24850d7f`
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
- [[_COMMUNITY_server.js|server.js]]
- [[_COMMUNITY_firestore.js|firestore.js]]
- [[_COMMUNITY_ExplainabilityPanel.jsx|ExplainabilityPanel.jsx]]
- [[_COMMUNITY_useCityStore|useCityStore]]
- [[_COMMUNITY_README|README.md]]
- [[_COMMUNITY_Dashboard.jsx|Dashboard.jsx]]
- [[_COMMUNITY_Frontend Requirements|Frontend Requirements]]
- [[_COMMUNITY_init_firestore.js|init_firestore.js]]
- [[_COMMUNITY_CommunityImpactPanel.jsx|CommunityImpactPanel.jsx]]
- [[_COMMUNITY_HealthAdvisory.jsx|HealthAdvisory.jsx]]
- [[_COMMUNITY_TourismPanel.jsx|TourismPanel.jsx]]
- [[_COMMUNITY_environment.js|environment.js]]
- [[_COMMUNITY_plan.js|plan.js]]
- [[_COMMUNITY_community.js|community.js]]
- [[_COMMUNITY_education.js|education.js]]
- [[_COMMUNITY_waste.js|waste.js]]
- [[_COMMUNITY_WardDetailPanel.jsx|WardDetailPanel.jsx]]

## God Nodes (most connected - your core abstractions)
1. `getTrafficData()` - 11 edges
2. `useCityStore` - 11 edges
3. `forecastSeriesML()` - 9 edges
4. `embedTexts()` - 9 edges
5. `../layouts/Layout.astro` - 9 edges
6. `CityPulse — Implementation Brief for Claude Opus 4.8 / Claude Code` - 9 edges
7. `forecastSeries()` - 8 edges
8. `generateOneLiner()` - 8 edges
9. `detectAnomalies()` - 7 edges
10. `detectRateSpikes()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `searchSimilar()` --calls--> `cosineSimilarity()`  [INFERRED]
  backend/lib/vectorStore.js → backend/lib/gemini.js
- `MapView()` --references--> `react`  [EXTRACTED]
  frontend/src/components/MapView.jsx → frontend/package.json
- `AlertsPanel()` --calls--> `useCityStore`  [EXTRACTED]
  frontend/src/components/AlertsPanel.jsx → frontend/src/store/useCityStore.js
- `Dashboard()` --calls--> `useCityStore`  [EXTRACTED]
  frontend/src/components/Dashboard.jsx → frontend/src/store/useCityStore.js
- `QueryBar()` --calls--> `useCityStore`  [EXTRACTED]
  frontend/src/components/QueryBar.jsx → frontend/src/store/useCityStore.js

## Import Cycles
- None detected.

## Communities (42 total, 4 thin omitted)

### Community 0 - "Backend API & Server"
Cohesion: 0.11
Nodes (13): bigquery, DATA_FILE, __dirname, __filename, generateRecommendation(), router, router, router (+5 more)

### Community 1 - "Frontend React Components"
Cohesion: 0.08
Nodes (16): ../components/ActionCenter.jsx, ../components/AgenticPlanner.jsx, ../components/AlertsPanel.jsx, ../components/CitizenReport.jsx, ../components/CommunityImpactPanel.jsx, ../components/Dashboard.jsx, ../components/EducationPanel.jsx, ../components/EnergyPanel.jsx (+8 more)

### Community 2 - "Frontend App Assets"
Cohesion: 0.08
Nodes (22): ../assets/astro.svg, ../assets/background.svg, ../styles/global.css, dependencies, astro, @astrojs/react, @astrojs/vercel, lucide-react (+14 more)

### Community 3 - "Backend Config"
Cohesion: 0.08
Nodes (24): dependencies, cors, dotenv, express, express-rate-limit, @google-cloud/bigquery, @google-cloud/firestore, @google-cloud/vertexai (+16 more)

### Community 4 - "Frontend Config"
Cohesion: 0.12
Nodes (15): devDependencies, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom, engines, node, name (+7 more)

### Community 5 - "Root Workspace Config"
Cohesion: 0.13
Nodes (14): dependencies, express, devDependencies, concurrently, name, scripts, build, dev (+6 more)

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
Cohesion: 0.09
Nodes (35): getTrafficData(), analyzeImage(), cosineSimilarity(), embedCache, embeddingMode(), embeddingSpace(), embedTexts(), generateEmbeddings() (+27 more)

### Community 11 - "CityPulse 🏙️"
Cohesion: 0.33
Nodes (5): Bias & fairness, Data: synthetic vs. real, Human-in-the-loop, Model limitations, Responsible AI — CityPulse

### Community 12 - "init_bq.js"
Cohesion: 0.53
Nodes (7): accessor(), confidenceFromZ(), detectAnomalies(), detectRateSpikes(), mean(), severityFromZ(), std()

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
Cohesion: 0.40
Nodes (5): __dirname, __filename, getMemos(), MEMO_FILE, saveMemo()

### Community 20 - "generate_incidents.js"
Cohesion: 0.22
Nodes (7): DATA_DIR, __dirname, incidents, SEVERITIES, today, TYPES, wards

### Community 21 - "forecast.js"
Cohesion: 0.25
Nodes (16): buildRegressionData(), dot(), fitAdditive(), fitLinear(), fitOLS(), forecastSeries(), forecastSeriesML(), GRID (+8 more)

### Community 22 - "generate_environment.js"
Cohesion: 0.25
Nodes (6): DATA_DIR, __dirname, PROFILE, rows, today, wards

### Community 23 - "server.js"
Cohesion: 0.20
Nodes (7): ENERGY_DATA, router, WATER_DATA, clients, router, apiLimiter, app

### Community 24 - "firestore.js"
Cohesion: 0.14
Nodes (18): addIncident(), addMemo(), __dirname, fallbackAddIncident(), fallbackAddMemo(), fallbackGetIncidents(), fallbackGetMemos(), fallbackMemos (+10 more)

### Community 25 - "ExplainabilityPanel.jsx"
Cohesion: 0.17
Nodes (7): PLAN_ICONS, STEP_ICONS, categoryIcons, ExplainabilityPanel(), LABEL_COLOR, scoreColor(), WasteManagementPanel()

### Community 26 - "useCityStore"
Cohesion: 0.39
Nodes (5): AlertsPanel(), MapView(), CANNED_EXAMPLES, QueryBar(), useCityStore

### Community 27 - "README.md"
Cohesion: 0.25
Nodes (7): 🏆 Hackathon Demo Guide (How to Pitch), 🌟 Key Features, 💻 Local Setup, 🎯 Solution Areas Covered (12/12), 🛠️ Technology Stack (Google Cloud Native), 🚨 The Problem, ✨ The Solution: Decision Intelligence

### Community 28 - "Dashboard.jsx"
Cohesion: 0.43
Nodes (6): aqiWord(), congestionWord(), Dashboard(), KPI_ICONS, scoreColor(), tooltipStyle

### Community 29 - "Frontend Requirements"
Cohesion: 0.33
Nodes (5): Build & Development Commands, Deploy Target Requirements, Environment Variables, Frontend Requirements, Runtime & Engine Requirements

### Community 30 - "init_firestore.js"
Cohesion: 0.40
Nodes (3): __dirname, __filename, INCIDENTS_FILE

### Community 31 - "CommunityImpactPanel.jsx"
Cohesion: 0.83
Nodes (3): CommunityImpactPanel(), sviColor(), sviLabel()

### Community 36 - "environment.js"
Cohesion: 0.18
Nodes (7): generateOneLiner(), __dirname, __filename, router, LOCAL_EVENTS, POINTS_OF_INTEREST, router

### Community 37 - "plan.js"
Cohesion: 0.20
Nodes (6): __dirname, ENERGY_DATA, __filename, PLAN_TYPES, router, TOURISM_POI

### Community 38 - "community.js"
Cohesion: 0.29
Nodes (3): __dirname, __filename, router

### Community 39 - "education.js"
Cohesion: 0.33
Nodes (4): generateStructured(), __dirname, __filename, router

### Community 40 - "waste.js"
Cohesion: 0.33
Nodes (3): __dirname, __filename, router

### Community 41 - "WardDetailPanel.jsx"
Cohesion: 0.83
Nodes (3): livabilityEmoji(), livabilityWord(), WardDetailPanel()

## Knowledge Gaps
- **200 isolated node(s):** `__filename`, `__dirname`, `DATA_FILE`, `__filename`, `__dirname` (+195 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Frontend App Assets` to `Frontend Config`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `../layouts/Layout.astro` connect `Frontend App Assets` to `Frontend React Components`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `MapView()` connect `useCityStore` to `Frontend App Assets`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `DATA_FILE` to the rest of the system?**
  _200 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Backend API & Server` be split into smaller, more focused modules?**
  _Cohesion score 0.11255411255411256 - nodes in this community are weakly interconnected._
- **Should `Frontend React Components` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Frontend App Assets` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._