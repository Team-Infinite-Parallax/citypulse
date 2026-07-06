<div align="center">
  <h1>🏙️ CityPulse</h1>
  <p><strong>AI-powered Decision Intelligence Platform for Better Living and Smarter Communities</strong></p>
  <p><em>Built for <strong>Gen AI Academy APAC</strong> by Team <strong>Infinite Parallax</strong></em></p>
  <br/>
</div>

## 🏆 Hackathon Demo Guide (How to Pitch)

If you are judging this project, here is the recommended path to see the core value proposition:

1. 📸 **The Cross-Domain Story:** Open the **Citizen View** and submit a report with a photo (e.g., a pothole). Note how the `Gemini Multimodal Vision API` automatically classifies it.
2. 🌊 **The Ripple Effect:** Switch to the **Planner View**. Observe how this new incident affects the **Social Vulnerability Index** and **Congestion Forecasts** for that specific ward in real-time.
3. ⚡ **The Intelligent Automation:** In the **Action Center**, you will see a new **CRITICAL** or **HIGH** anomaly. Click it to view the **AI-Drafted Action Memo**. 
4. 🛡️ **Responsible AI:** Note the explicit `HUMAN-IN-THE-LOOP REQUIRED` badge. The system drafts the dispatch, but a human must approve it.
5. 🎙️ **Ask the City:** Finally, use the Voice Input (Multimodal) in the top search bar to ask: *"What is the impact of the recent pothole reports in Ward 14 on local traffic?"* The system will use RAG across all domains to give a grounded answer with an explainability panel.

---

## 🚨 The Problem

> *"I spend 6 hours every week cross-referencing PDF reports from Traffic, Sanitation, and Police to decide where to deploy inspectors. By Monday the data is stale."*  
> — **Zonal Officer, Lucknow Municipal Corporation**

Modern cities generate thousands of civic data points daily—traffic sensors, incident logs, AQI monitors, and citizen reports. However, **departments operate in silos**. Cross-domain patterns (e.g., *"Ward 14 has rising congestion AND a spike in emergency calls AND falling waste collection"*) go undetected until they compound into crises.

**The Gap:** No single tool can ingest cross-domain city data, answer ad-hoc questions in natural language, forecast outcomes, and close the loop with automated action.

---

## ✨ The Solution: Decision Intelligence

CityPulse solves this by integrating **all 12 suggested solution areas** into a unified decision-intelligence loop powered entirely by **Google Cloud's AI ecosystem**.

```text
📊 Data Sources → 🧠 AI Analysis → 📈 Pattern Detection → ⚠️ Anomaly Alert
                                                                ↓
             ✅ Human Approval ← 📝 AI Action Memo ← 🤖 Auto-Draft (Gemini)
                   ↓
            🚀 Dispatch & Resolution → 🔄 Feedback into Data Sources
```

---

## 🌟 Key Features

*   🗣️ **Conversational AI ("Ask the City"):** Multi-domain RAG query engine. Supports voice input and returns grounded answers with "Why?" explainability panels showing confidence and sources.
*   🔮 **Predictive Analytics:** Holt-Winters forecasting with 90% prediction intervals for congestion trends, visualized with confidence bands.
*   🤖 **AI Agentic Workflows (ADK Pattern):** Multi-step planning agents (e.g., *Disaster Preparedness*, *Ideal Commute*) that orchestrate cross-domain tool calls with visible reasoning chains.
*   ⚡ **Automated Decision Loop:** Shared z-score anomaly engine across domains. **CRITICAL/HIGH** anomalies trigger Gemini to one-click auto-draft Action Memos.
*   👁️ **Multimodal Understanding:** Supports Voice queries and Photo uploads (Gemini Vision classifies pothole/garbage/waterlogging).
*   🛡️ **Explainable & Responsible AI:** Every AI output includes confidence scores, retrieved sources, and plain-language rationale. Memos strictly enforce **Human-in-the-Loop**.
*   👥 **Role-Based Views:** A highly technical **Planner View** and an accessible, high-contrast **Citizen View** (with Lite mode for low bandwidth).

---

## 🛠️ Technology Stack (Google Cloud Native)

| Google Cloud Service | Role in CityPulse |
| :--- | :--- |
| **Vertex AI (Gemini 3 Flash)** | Natural-language Q&A, RAG generation, Vision (photo classification), structured JSON generation, action memo drafting. |
| **Vertex AI Embeddings** | Cross-domain vector embeddings (`gemini-embedding-001`) for semantic retrieval across 6 domains. |
| **BigQuery** | Live OLAP queries on traffic, environment, and incident data. |
| **Firestore** | Persistent storage for citizen reports, action memos, and incidents. |
| **AlloyDB / pgvector** | Production vector store for RAG retrieval (OLTP + vector search). |
| **Cloud Run** | Containerized backend deployment. |

**Frontend Stack:** Astro 7, React 19, Tailwind CSS 4, Zustand, MapLibre GL, Recharts.

---

## 🎯 Solution Areas Covered (12/12)

Yes, we integrated all 12 suggested hackathon areas into one cohesive platform:

| Area | Implementation Highlights |
| :--- | :--- |
| 🚗 **Urban Mobility** | Live congestion, delay tracking, Holt-Winters forecasting. |
| 🚨 **Public Safety** | Incident intelligence, anomaly detection, AI action memos. |
| 🏥 **Healthcare** | Health-advisory engine (AQI × congestion), vulnerable-group alerts. |
| 📚 **Education** | Community Learning Hub, AI cross-domain skill recommendations. |
| 🌱 **Environment** | AQI tracking, water quality index, composite livability scores. |
| ♻️ **Waste Management** | Collection efficiency tracking, Gemini optimization recommendations. |
| ⚡ **Energy & Utilities** | Energy consumption maps, solar adoption rates, loss tracking. |
| 💬 **Citizen Engagement** | Multimodal citizen reporting, real-time SSE alerts. |
| ♿ **Accessibility** | High-contrast Citizen view, lite mode, plain-language AI. |
| 🌪️ **Disaster Response** | Agentic planning identifying priority wards, spike detection. |
| 🗺️ **Tourism & Economy** | POI map, AI economic impact assessments, hotspot ranking. |
| 🤝 **Community Support** | Social Vulnerability Index, volunteer coordination hub. |

---

## 💻 Local Setup

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

*Built with ❤️ for Gen AI Academy APAC*
