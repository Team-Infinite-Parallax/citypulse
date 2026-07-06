/* -------------------------------------------------------------------------- */
/*  Shared anomaly detection — used across ALL CityPulse domains (mobility,      */
/*  public safety, waste/environment). Both the traffic alert path and the new   */
/*  domain modules import from here, so "anomaly" means the same thing (a real    */
/*  statistical spike vs. an entity's own rolling baseline) everywhere.          */
/*                                                                              */
/*  Two entry points:                                                           */
/*    detectAnomalies(records, opts)  — point anomalies: flag a reading that is   */
/*        z std-devs above an entity's trailing rolling baseline.               */
/*    detectRateSpikes(events, opts)  — count events per (entity, time-bucket)    */
/*        and flag buckets whose count spikes above the entity's own baseline.   */
/* -------------------------------------------------------------------------- */

const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);

const std = (a) => {
  if (a.length < 2) return 0;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / (a.length - 1));
};

const round = (v) => (Number.isFinite(v) ? Number(v.toFixed(2)) : v);

// Accept either a field name ('congestion') or an accessor fn (r => r.x).
const accessor = (spec) =>
  typeof spec === 'function' ? spec : (r) => r[spec];

// Map a z-score to a coarse severity band shared by every domain.
export const severityFromZ = (z) => {
  const a = Math.abs(z);
  if (a >= 4) return 'CRITICAL';
  if (a >= 3) return 'HIGH';
  if (a >= 2) return 'WARNING';
  return 'INFO';
};

// Confidence in [0,1] derived from how far past threshold the z-score sits.
export const confidenceFromZ = (z, threshold = 2) => {
  const a = Math.abs(z);
  if (!Number.isFinite(a)) return 1;
  return Math.max(0, Math.min(1, (a - threshold) / (5 - threshold) + 0.5));
};

/**
 * Point anomalies vs a per-entity trailing rolling baseline.
 *
 * @param {object[]} records
 * @param {object} opts
 *   groupBy     field name or fn — the entity (route, ward, …)
 *   value       field name or fn — the numeric metric
 *   timestamp   field name or fn — orders the series (default 'timestamp')
 *   window      trailing baseline length (default 24)
 *   z           z-score threshold (default 2.5)
 *   minBaseline minimum prior points before scoring (default 6)
 *   direction   'high' (spikes) | 'both' (default 'high')
 * @returns {{key,value,timestamp,baseline,std,zscore,severity,confidence,record}[]}
 */
export const detectAnomalies = (records, opts = {}) => {
  const {
    groupBy,
    value,
    timestamp = 'timestamp',
    window = 24,
    z = 2.5,
    minBaseline = 6,
    direction = 'high',
  } = opts;

  const getKey = accessor(groupBy);
  const getVal = accessor(value);
  const getTs = accessor(timestamp);

  const groups = new Map();
  for (const r of records) {
    const k = getKey(r);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }

  const out = [];
  for (const [key, rows] of groups) {
    rows.sort((a, b) => new Date(getTs(a)) - new Date(getTs(b)));
    const vals = rows.map(getVal);
    for (let i = 0; i < rows.length; i++) {
      const past = vals.slice(Math.max(0, i - window), i);
      if (past.length < minBaseline) continue;
      const m = mean(past);
      const sd = std(past);
      const v = vals[i];
      const zscore = sd > 0 ? (v - m) / sd : v > m ? Infinity : 0;
      const flagged = direction === 'high' ? zscore >= z : Math.abs(zscore) >= z;
      if (!flagged) continue;
      out.push({
        key,
        value: v,
        timestamp: getTs(rows[i]),
        baseline: round(m),
        std: round(sd),
        zscore: Number.isFinite(zscore) ? round(zscore) : 99,
        severity: severityFromZ(zscore),
        confidence: round(confidenceFromZ(zscore, z)),
        record: rows[i],
      });
    }
  }
  return out.sort((a, b) => b.zscore - a.zscore);
};

/**
 * Rate spikes: bucket events per entity per time window, then z-score the
 * per-bucket counts against the entity's own trailing baseline. Used e.g. to
 * flag wards whose incident count spikes above their normal daily rate.
 *
 * @param {object[]} events
 * @param {object} opts
 *   groupBy     field name or fn — the entity (ward, …)
 *   timestamp   field name or fn (default 'timestamp')
 *   bucketHours size of each count bucket in hours (default 24)
 *   window      trailing baseline length in buckets (default 7)
 *   z           z-score threshold (default 2)
 *   minBaseline minimum prior buckets before scoring (default 3)
 * @returns {{key,count,bucketStart,baseline,std,zscore,severity,confidence}[]}
 */
export const detectRateSpikes = (events, opts = {}) => {
  const {
    groupBy,
    timestamp = 'timestamp',
    bucketHours = 24,
    window = 7,
    z = 2,
    minBaseline = 3,
  } = opts;

  const getKey = accessor(groupBy);
  const getTs = accessor(timestamp);
  const bucketMs = bucketHours * 3600 * 1000;

  // entity -> Map(bucketIndex -> count)
  const perEntity = new Map();
  let minBucket = Infinity;
  let maxBucket = -Infinity;
  for (const e of events) {
    const k = getKey(e);
    const b = Math.floor(new Date(getTs(e)).getTime() / bucketMs);
    if (!perEntity.has(k)) perEntity.set(k, new Map());
    const m = perEntity.get(k);
    m.set(b, (m.get(b) || 0) + 1);
    if (b < minBucket) minBucket = b;
    if (b > maxBucket) maxBucket = b;
  }

  const out = [];
  for (const [key, counts] of perEntity) {
    const series = [];
    for (let b = minBucket; b <= maxBucket; b++) series.push(counts.get(b) || 0);
    for (let i = 0; i < series.length; i++) {
      const past = series.slice(Math.max(0, i - window), i);
      if (past.length < minBaseline) continue;
      const m = mean(past);
      const sd = std(past);
      const c = series[i];
      if (c === 0) continue; // an empty bucket is not a spike
      const zscore = sd > 0 ? (c - m) / sd : c > m ? Infinity : 0;
      if (zscore < z) continue;
      out.push({
        key,
        count: c,
        bucketStart: new Date((minBucket + i) * bucketMs).toISOString(),
        baseline: round(m),
        std: round(sd),
        zscore: Number.isFinite(zscore) ? round(zscore) : 99,
        severity: severityFromZ(zscore),
        confidence: round(confidenceFromZ(zscore, z)),
      });
    }
  }
  return out.sort((a, b) => b.zscore - a.zscore);
};
