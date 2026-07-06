/* -------------------------------------------------------------------------- */
/*  Real time-series forecasting: additive Holt-Winters exponential smoothing   */
/*  (level + trend + seasonality) with prediction intervals.                    */
/*                                                                              */
/*  This replaces the earlier simple moving-average / seasonal-naive method.    */
/*  Smoothing parameters (alpha, beta, gamma) are FIT to each series via a      */
/*  coarse grid search that minimises in-sample one-step error — so the output  */
/*  is genuinely downstream of the data, not a hand-tuned constant. Prediction  */
/*  intervals come from the one-step residual variance, widened with the        */
/*  forecast horizon (SES error-variance approximation). Pure JS, no service.   */
/* -------------------------------------------------------------------------- */

const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);

const sampleStd = (a) => {
  if (a.length < 2) return 0;
  const m = mean(a);
  const v = a.reduce((s, x) => s + (x - m) * (x - m), 0) / (a.length - 1);
  return Math.sqrt(v);
};

/**
 * Fit additive Holt-Winters for one (alpha, beta, gamma) triple and return the
 * final smoothing state plus the in-sample one-step residuals.
 */
const fitAdditive = (y, m, alpha, beta, gamma) => {
  const n = y.length;
  const level0 = mean(y.slice(0, m));

  // Initial trend: average per-step change between the first two seasons.
  let trend0 = 0;
  for (let i = 0; i < m; i++) trend0 += (y[m + i] - y[i]) / m;
  trend0 /= m;

  // Initial seasonal components (additive: observation minus starting level).
  const s = new Array(m);
  for (let i = 0; i < m; i++) s[i] = y[i] - level0;

  let level = level0;
  let trend = trend0;
  const residuals = [];

  for (let t = 0; t < n; t++) {
    const phase = t % m;
    const prevLevel = level;
    const prevTrend = trend;

    // One-step-ahead forecast made *before* seeing y[t]; scored once we have a
    // full season of seasonal estimates (t >= m).
    if (t >= m) {
      const yhat = prevLevel + prevTrend + s[phase];
      residuals.push(y[t] - yhat);
    }

    level = alpha * (y[t] - s[phase]) + (1 - alpha) * (prevLevel + prevTrend);
    trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;
    s[phase] = gamma * (y[t] - level) + (1 - gamma) * s[phase];
  }

  return { level, trend, seasonal: s, residuals };
};

/** Fit Holt's linear trend (double exponential smoothing, no seasonality). */
const fitLinear = (y, alpha, beta) => {
  const n = y.length;
  let level = y[0];
  let trend = y.length > 1 ? y[1] - y[0] : 0;
  const residuals = [];
  for (let t = 1; t < n; t++) {
    const prevLevel = level;
    const prevTrend = trend;
    const yhat = prevLevel + prevTrend;
    residuals.push(y[t] - yhat);
    level = alpha * y[t] + (1 - alpha) * (prevLevel + prevTrend);
    trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;
  }
  return { level, trend, residuals };
};

const GRID = [0.1, 0.3, 0.5, 0.7, 0.9];
const sse = (res) => res.reduce((s, e) => s + e * e, 0);

/**
 * Forecast the next `horizon` steps of a numeric series.
 *
 * @param {number[]} series  Observations, oldest -> newest.
 * @param {object}   opts    { period=24, horizon=6, z=1.645, clamp=[lo,hi] }
 * @returns {{ point:number[], lower:number[], upper:number[],
 *             method:string, params:object, residualStd:number, seasonal:boolean }}
 */
export const forecastSeries = (series, opts = {}) => {
  const { period = 24, horizon = 6, z = 1.645, clamp = null } = opts;
  const y = series.filter((v) => typeof v === 'number' && !Number.isNaN(v));
  const n = y.length;

  const bound = (v) =>
    clamp ? Math.max(clamp[0], Math.min(clamp[1], v)) : v;

  // --- Not enough data for any model: flat naive forecast. --------------------
  if (n < 4) {
    const last = n ? y[n - 1] : 0;
    const std = sampleStd(y.slice(-Math.min(n, 3)));
    const point = Array.from({ length: horizon }, () => bound(Math.round(last)));
    const half = point.map(() => z * std);
    return {
      point,
      lower: point.map((p, k) => bound(Math.round(p - half[k]))),
      upper: point.map((p, k) => bound(Math.round(p + half[k]))),
      method: 'naive (insufficient history)',
      params: {},
      residualStd: Number(std.toFixed(2)),
      seasonal: false,
    };
  }

  const seasonal = n >= 2 * period;
  let state;
  let bestParams;

  if (seasonal) {
    let best = null;
    for (const alpha of GRID)
      for (const beta of GRID)
        for (const gamma of GRID) {
          const fit = fitAdditive(y, period, alpha, beta, gamma);
          const err = sse(fit.residuals);
          if (!best || err < best.err) best = { err, fit, alpha, beta, gamma };
        }
    state = best.fit;
    bestParams = { alpha: best.alpha, beta: best.beta, gamma: best.gamma };
  } else {
    // Seasonality needs >= 2 full periods; fall back to Holt's linear trend.
    let best = null;
    for (const alpha of GRID)
      for (const beta of GRID) {
        const fit = fitLinear(y, alpha, beta);
        const err = sse(fit.residuals);
        if (!best || err < best.err) best = { err, fit, alpha, beta };
      }
    state = best.fit;
    bestParams = { alpha: best.alpha, beta: best.beta };
  }

  const residualStd = sampleStd(state.residuals);
  const { level, trend } = state;
  const alpha = bestParams.alpha;

  const point = [];
  const lower = [];
  const upper = [];
  for (let k = 1; k <= horizon; k++) {
    const seasonalTerm = seasonal ? state.seasonal[(n - 1 + k) % period] : 0;
    const p = level + k * trend + seasonalTerm;
    // SES-style h-step error-variance approximation: var grows with horizon.
    const varK = residualStd * residualStd * (1 + (k - 1) * alpha * alpha);
    const half = z * Math.sqrt(varK);
    point.push(bound(Math.round(p)));
    lower.push(bound(Math.round(p - half)));
    upper.push(bound(Math.round(p + half)));
  }

  return {
    point,
    lower,
    upper,
    method: seasonal
      ? `Holt-Winters additive (level+trend+${period}h seasonality)`
      : "Holt's linear trend (double exponential smoothing)",
    params: bestParams,
    residualStd: Number(residualStd.toFixed(2)),
    seasonal,
  };
};
