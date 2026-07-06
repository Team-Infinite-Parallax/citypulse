import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area, ComposedChart, Line, Legend, ReferenceLine
} from 'recharts';
import useCityStore from '../store/useCityStore';
import { AlertCircle, Clock, Activity, Gauge, Wind, Filter, TrendingUp } from 'lucide-react';
import routesGeoJson from '../data/routes.json';

const FLOW = '#31D0AA', CAUTION = '#F97316', STOP = '#FF5A5F', AQI_COLOR = '#8B5CF6';

const scoreColor = (v) => (v >= 70 ? STOP : v >= 40 ? CAUTION : FLOW);

const KPI_ICONS = {
  congestion: { icon: Gauge, label: 'Avg Congestion', unit: '/100' },
  delay: { icon: Clock, label: 'Avg Delay', unit: 'min' },
  peak: { icon: Activity, label: 'Peak Hour', unit: '' },
  aqi: { icon: Wind, label: 'Avg AQI', unit: '' },
};

const tooltipStyle = {
  background: 'rgba(19, 26, 38, 0.85)', 
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  borderRadius: '12px', color: '#E6EDF3', fontSize: 12,
};

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRoute, setFilterRoute] = useState('');

  const selectedRoute = useCityStore((state) => state.selectedRoute);
  const setSelectedRoute = useCityStore((state) => state.setSelectedRoute);

  const routeNames = useMemo(() => {
    if (!routesGeoJson?.features) return [];
    const names = routesGeoJson.features.map(f => f.properties?.name).filter(Boolean);
    return [...new Set(names)];
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API = import.meta.env.PUBLIC_API_URL || '';
        const [summaryRes, trafficRes, forecastRes] = await Promise.all([
          fetch(`${API}/api/traffic/summary`),
          fetch(`${API}/api/traffic`),
          fetch(`${API}/api/forecast?h=6`)
        ]);

        if (!summaryRes.ok || !trafficRes.ok) throw new Error('Failed to fetch data');

        setSummaryData(await summaryRes.json());
        setTrafficData(await trafficRes.json());
        // Forecast is enhancement-only; don't fail the whole dashboard if it errors.
        setForecastData(forecastRes.ok ? await forecastRes.json() : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeRoute = filterRoute || selectedRoute || '';

  const displaySummary = activeRoute
    ? summaryData.filter(s => s.route_name === activeRoute)
    : summaryData;
  const displayTraffic = activeRoute
    ? trafficData.filter(t => t.route_name === activeRoute)
    : trafficData;

  const delayChartData = displaySummary.map(s => ({ name: s.route_name, Delay: s.avg_delay_minutes }));

  const sortedTraffic = [...displayTraffic].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const trendDataRaw = {};
  sortedTraffic.forEach(t => {
    const time = new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!trendDataRaw[time]) trendDataRaw[time] = { time, congestion: 0, count: 0 };
    trendDataRaw[time].congestion += t.congestion;
    trendDataRaw[time].count += 1;
  });
  const trendData = Object.values(trendDataRaw)
    .map(d => ({ time: d.time, Congestion: Math.round(d.congestion / d.count) }))
    .slice(-24);

  // Forecast: pick the active route's forecast, else the worst current corridor.
  const activeForecast = useMemo(() => {
    if (!forecastData.length) return null;
    if (activeRoute) return forecastData.find(f => f.route_name === activeRoute) || null;
    return [...forecastData].sort((a, b) => b.current_congestion - a.current_congestion)[0];
  }, [forecastData, activeRoute]);

  // Combined series: recent actuals + forecast with a prediction band. Keyed on
  // the ISO timestamp so history and forecast points never collide on the axis.
  const forecastChartData = useMemo(() => {
    if (!activeForecast) return [];
    const hist = activeForecast.history.slice(-24).map(h => ({
      ts: h.ts, label: h.label, Actual: h.congestion,
    }));
    if (hist.length) {
      // Anchor the forecast line + band to the last observed value.
      const lastActual = hist[hist.length - 1].Actual;
      hist[hist.length - 1] = {
        ...hist[hist.length - 1], Forecast: lastActual, range: [lastActual, lastActual],
      };
    }
    const fc = activeForecast.forecast_series.map(f => ({
      ts: f.ts, label: f.label, Forecast: f.forecast, range: [f.lower, f.upper],
    }));
    return [...hist, ...fc];
  }, [activeForecast]);

  const boundaryTs = activeForecast?.forecast_series?.[0]?.ts;
  const fmtHour = (ts) => {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, '0')}:00`;
  };

  const overallAvgCongestion = displaySummary.length > 0
    ? Math.round(displaySummary.reduce((a, s) => a + s.avg_congestion, 0) / displaySummary.length)
    : 0;
  const overallAvgDelay = displaySummary.length > 0
    ? Math.round(displaySummary.reduce((a, s) => a + s.avg_delay_minutes, 0) / displaySummary.length)
    : 0;
  const peakHour = displaySummary.length === 1 ? displaySummary[0].peak_hour
    : displaySummary.length > 1 ? 'Var'
    : '--';
  const overallAvgAqi = displayTraffic.length > 0
    ? Math.round(displayTraffic.reduce((a, t) => a + (t.aqi || 50), 0) / displayTraffic.length)
    : 50;

  const congColor = scoreColor(overallAvgCongestion);

  const kpiCards = [
    {
      key: 'congestion',
      value: overallAvgCongestion,
      unit: '/100',
      color: congColor,
      extra: (
        <div className="mt-3 h-1.5 rounded-full bg-[#0E141E] overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${overallAvgCongestion}%`, background: congColor }} />
        </div>
      ),
    },
    {
      key: 'delay',
      value: overallAvgDelay,
      unit: 'min',
      color: '#F97316',
      extra: <p className="mono text-[11px] text-[#8896A8] mt-3">vs. free-flow baseline</p>,
    },
    {
      key: 'peak',
      value: peakHour,
      unit: '',
      color: '#31D0AA',
      extra: <p className="mono text-[11px] text-[#8896A8] mt-3">busiest window</p>,
    },
    {
      key: 'aqi',
      value: overallAvgAqi,
      unit: '',
      color: AQI_COLOR,
      extra: <p className="mono text-[11px] text-[#8896A8] mt-3">air quality index</p>,
    },
  ];

  const handleRouteFilter = (e) => {
    const val = e.target.value;
    setFilterRoute(val);
    setSelectedRoute(val);
  };

  if (loading) {
    return (
      <div className="panel h-64 flex flex-col justify-center items-center gap-3" aria-live="polite">
        <div className="w-8 h-8 border-2 border-[#FFB020] border-t-transparent rounded-full animate-spin"></div>
        <span className="eyebrow">Loading telemetry…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel p-6 flex items-center text-[#FF9497] border-[#FF5A5F]/30" aria-live="assertive">
        <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Route Filter */}
      <div className="flex items-center gap-3 route-filter">
        <Filter className="filter-icon" />
        <select
          aria-label="Filter by route"
          value={activeRoute}
          onChange={handleRouteFilter}
          className="route-select"
        >
          <option value="">All routes</option>
          {routeNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {activeRoute && (
          <button
            type="button"
            onClick={() => { setFilterRoute(''); setSelectedRoute(''); }}
            className="text-xs clear-filter hover:text-[#E6EDF3] transition-colors px-2 py-1"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ key, value, unit, color, extra }) => {
          const meta = KPI_ICONS[key];
          const Icon = meta.icon;
          return (
            <div key={key} className="panel p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="eyebrow">{meta.label}</span>
                <div className="w-8 h-8 rounded-lg grid place-items-center border"
                     style={{ background: `${color}1a`, borderColor: `${color}44`, color }}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="stat text-2xl sm:text-4xl" style={{ color: key === 'congestion' ? color : '#E6EDF3' }}>
                  {value}
                </span>
                {unit && <span className="text-[#8896A8] text-sm">{unit}</span>}
              </div>
              {extra}
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="panel">
          <div className="panel-head">
            <h3 className="text-base font-semibold text-[#E6EDF3]">Congestion Trend · 24h</h3>
            <span className="eyebrow">{activeRoute || 'All corridors'}</span>
          </div>
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="congFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={FLOW} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={FLOW} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1B2534" />
                <XAxis dataKey="time" stroke="#8896A8" fontSize={12} tickMargin={8} minTickGap={30} tickLine={false} axisLine={{ stroke: '#1B2534' }} />
                <YAxis stroke="#8896A8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ stroke: '#263244' }} contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="Congestion" stroke={FLOW} strokeWidth={2.5}
                      fill="url(#congFill)" dot={false} activeDot={{ r: 5, fill: FLOW, stroke: '#0B0E14', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3 className="text-base font-semibold text-[#E6EDF3]">Avg Delay by Route</h3>
            <span className="eyebrow">minutes</span>
          </div>
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayChartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1B2534" />
                <XAxis dataKey="name" stroke="#8896A8" fontSize={12} tickMargin={8} tickLine={false} axisLine={{ stroke: '#1B2534' }} />
                <YAxis stroke="#8896A8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={tooltipStyle} />
                <Bar dataKey="Delay" fill={CAUTION} radius={[4, 4, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Forecast with prediction interval (Holt-Winters) */}
      {activeForecast && (
        <div className="panel">
          <div className="panel-head">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#31D0AA]" />
              <h3 className="text-base font-semibold text-[#E6EDF3]">
                Congestion Forecast · next {activeForecast.horizon_hours}h
              </h3>
            </div>
            <span className="eyebrow">{activeForecast.route_name} · 90% band</span>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastChartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#31D0AA" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#31D0AA" stopOpacity={0.06} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1B2534" />
                <XAxis dataKey="ts" tickFormatter={fmtHour} stroke="#8896A8" fontSize={11}
                       tickMargin={8} minTickGap={28} tickLine={false} axisLine={{ stroke: '#1B2534' }} />
                <YAxis domain={[0, 100]} stroke="#8896A8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  cursor={{ stroke: '#263244' }}
                  contentStyle={tooltipStyle}
                  labelFormatter={(ts) => {
                    const p = forecastChartData.find(d => d.ts === ts);
                    return p ? p.label : ts;
                  }}
                  formatter={(value, name) => {
                    if (name === 'Uncertainty band' && Array.isArray(value))
                      return [`${value[0]}–${value[1]}`, name];
                    return [value, name];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="range" name="Uncertainty band" stroke="none"
                      fill="url(#bandFill)" connectNulls={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="Actual" name="Actual" stroke="#8896A8" strokeWidth={2}
                      dot={false} connectNulls={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="Forecast" name="Forecast" stroke="#31D0AA" strokeWidth={2.5}
                      strokeDasharray="5 4" dot={false} connectNulls isAnimationActive={false} />
                {boundaryTs && (
                  <ReferenceLine x={boundaryTs} stroke="#FFB020" strokeDasharray="2 4"
                                 label={{ value: 'now', position: 'top', fill: '#FFB020', fontSize: 10 }} />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="px-4 pb-4 -mt-1">
            <p className="mono text-[11px] text-[#64748B]">
              {activeForecast.method}
              {activeForecast.params?.alpha != null && (
                <> · α={activeForecast.params.alpha} β={activeForecast.params.beta}
                  {activeForecast.params.gamma != null && <> γ={activeForecast.params.gamma}</>}
                </>
              )} · σ={activeForecast.residual_std}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
