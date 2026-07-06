# Responsible AI — CityPulse

CityPulse is a decision-**support** tool for city staff and citizens. It surfaces
patterns and drafts recommendations; it does not take autonomous action. This
note states plainly what the data is, where the models are weak, and where a
human must stay in the loop.

## Data: synthetic vs. real

| Dataset | Status | Notes |
|---|---|---|
| Traffic congestion / delay | **Synthetic** | Generated hourly for 5 corridors (`backend/scripts/generate_data.js`), with a seeded incident. |
| Air-quality (AQI) | **Synthetic** | Correlated with congestion plus noise. |
| Public-safety incidents | **Synthetic** | ~300 ward-level records (`backend/data/incidents.json`). In production mode, these persist in Firestore. |
| Waste / water-quality | **Synthetic** | Ward-level (`backend/data/environment.json`). |
| Citizen reports | **User-generated at runtime** | Free-text + optional photo. Persisted in Firestore in production mode. |
| Action memos | **Synthetic** | Structured decision drafts. In production mode, memos persist in Firestore (still requiring manual approval/dispatch). |
| Tourism POIs / events | **Static demo data** | 8 points of interest + 4 events in `routes/tourism.js`. Illustrative only. |
| Energy / water utility data | **Static demo data** | 5 wards tracked in `routes/energy.js`. Not a live SCADA feed. |

All coordinates sit near the demo map center so markers render; they are
illustrative, **not** a real municipal feed. In production these become BigQuery
tables / live sensor and 311 feeds behind the same interfaces.

## Model limitations

- **Forecasting** uses additive Holt-Winters exponential smoothing. Quality
  depends on history density per corridor — short or sparse series fall back to a
  linear-trend or naive model, and prediction intervals widen accordingly. It
  does not model weather, events, or road works. The band is a statistical
  approximation, not a guarantee.
- **RAG answers** are grounded only in retrieved records; low similarity scores
  (shown in every "Why this answer?" panel) mean low confidence — read them.
- **Photo classification** (Gemini Vision) can mislabel; every citizen report is
  editable/reviewable, never auto-actioned.

## Human-in-the-loop

Action Memos are generated as **drafts**. Nothing is dispatched until a human
clicks *Approve & Dispatch*. **Dispatch itself is a stub for this demo** — it
flips a status and logs a timestamp; it does **not** send real email/SMS or
notify any real department. Wiring a real notification channel is deliberately
left as an integration step so no synthetic alert can reach a real responder.

## Bias & fairness

Forecast and anomaly quality scale with per-ward/per-corridor data density: wards
with sparse reporting get weaker baselines and may be under- or over-flagged.
Composite scores (e.g. Ward Livability) weight inputs equally by default — a
policy choice, not an objective truth — and should be reviewed before informing
resource allocation, so low-data areas are not systematically deprioritized.
