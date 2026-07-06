# Graph Report - .  (2026-07-05)

## Corpus Check
- Corpus is ~17,414 words - fits in a single context window. You may not need a graph.

## Summary
- 112 nodes · 119 edges · 9 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Backend API & Server|Backend API & Server]]
- [[_COMMUNITY_Frontend React Components|Frontend React Components]]
- [[_COMMUNITY_Frontend App Assets|Frontend App Assets]]
- [[_COMMUNITY_Backend Config|Backend Config]]
- [[_COMMUNITY_Frontend Config|Frontend Config]]
- [[_COMMUNITY_Root Workspace Config|Root Workspace Config]]
- [[_COMMUNITY_Frontend Build Config|Frontend Build Config]]
- [[_COMMUNITY_Backend Utility Scripts|Backend Utility Scripts]]

## God Nodes (most connected - your core abstractions)
1. `useCityStore` - 7 edges
2. `scripts` - 5 edges
3. `scripts` - 5 edges
4. `scripts` - 3 edges
5. `compilerOptions` - 3 edges
6. `generateQueryResponse()` - 2 edges
7. `generateRecommendation()` - 2 edges
8. `router` - 2 edges
9. `router` - 2 edges
10. `getTrafficData()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --calls--> `useCityStore`  [EXTRACTED]
  frontend/src/components/Dashboard.jsx → frontend/src/store/useCityStore.js
- `MapView()` --calls--> `useCityStore`  [EXTRACTED]
  frontend/src/components/MapView.jsx → frontend/src/store/useCityStore.js
- `QueryBar()` --calls--> `useCityStore`  [EXTRACTED]
  frontend/src/components/QueryBar.jsx → frontend/src/store/useCityStore.js

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "Backend API & Server"
Cohesion: 0.10
Nodes (18): ai, generateQueryResponse(), generateRecommendation(), DATA_FILE, __dirname, __filename, router, DATA_FILE (+10 more)

### Community 1 - "Frontend React Components"
Cohesion: 0.14
Nodes (11): ../components/AlertsPanel.jsx, ../components/Dashboard.jsx, ../components/MapView.jsx, ../components/QueryBar.jsx, ../components/RecommendationCard.jsx, ../styles/global.css, Dashboard(), MapView() (+3 more)

### Community 2 - "Frontend App Assets"
Cohesion: 0.12
Nodes (14): ../assets/astro.svg, ../assets/background.svg, dependencies, astro, @astrojs/react, lucide-react, maplibre-gl, react (+6 more)

### Community 3 - "Backend Config"
Cohesion: 0.14
Nodes (13): dependencies, cors, dotenv, express, @google/genai, description, main, name (+5 more)

### Community 4 - "Frontend Config"
Cohesion: 0.14
Nodes (13): devDependencies, tailwindcss, @tailwindcss/vite, engines, node, name, scripts, astro (+5 more)

### Community 5 - "Root Workspace Config"
Cohesion: 0.20
Nodes (9): devDependencies, concurrently, name, scripts, dev, dev:backend, dev:frontend, install:all (+1 more)

### Community 6 - "Frontend Build Config"
Cohesion: 0.29
Nodes (6): compilerOptions, jsx, jsxImportSource, exclude, extends, include

### Community 7 - "Backend Utility Scripts"
Cohesion: 0.40
Nodes (4): data, dir, routes, today

## Knowledge Gaps
- **65 isolated node(s):** `ai`, `name`, `version`, `description`, `main` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Frontend App Assets` to `Frontend Config`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `ai`, `name`, `version` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Backend API & Server` be split into smaller, more focused modules?**
  _Cohesion score 0.10333333333333333 - nodes in this community are weakly interconnected._
- **Should `Frontend React Components` be split into smaller, more focused modules?**
  _Cohesion score 0.14210526315789473 - nodes in this community are weakly interconnected._
- **Should `Frontend App Assets` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Backend Config` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `Frontend Config` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._