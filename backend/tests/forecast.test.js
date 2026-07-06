import { forecastSeries, forecastSeriesML } from '../lib/forecast.js';

describe('forecast library', () => {
  it('forecastSeriesML returns a valid forecast and RMSE for seasonal data', () => {
    const series = Array.from({ length: 48 }, (_, i) =>
      Math.round(40 + 20 * Math.sin((2 * Math.PI * i) / 24) + (Math.random() * 6 - 3))
    );

    const baseline = forecastSeries(series, { period: 24, horizon: 6, clamp: [0, 100] });
    const ml = forecastSeriesML(series, { period: 24, horizon: 6, clamp: [0, 100] });

    expect(Array.isArray(ml.point)).toBe(true);
    expect(ml.point.length).toBe(6);
    expect(Array.isArray(ml.lower)).toBe(true);
    expect(Array.isArray(ml.upper)).toBe(true);
    expect(ml.lower.length).toBe(6);
    expect(ml.upper.length).toBe(6);
    expect(typeof ml.inSampleRmse).toBe('number');
    expect(typeof ml.method).toBe('string');
    expect(ml.method.length).toBeGreaterThan(0);
    expect(typeof baseline.inSampleRmse).toBe('number');
    expect(['number', 'string']).toContain(typeof baseline.method);
  });

  it('forecastSeriesML falls back cleanly for short series', () => {
    const series = [10, 12, 15, 14, 16, 13, 12];
    const ml = forecastSeriesML(series, { period: 24, horizon: 3, clamp: [0, 100] });

    expect(ml.point.length).toBe(3);
    expect(ml.method).toMatch(/fallback/i);
    expect(typeof ml.inSampleRmse).toBe('number');
  });
});
