import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import useCityStore from '../store/useCityStore';
import { AlertCircle, Clock, Activity, Gauge, Wind, Filter } from 'lucide-react';
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
        const [summaryRes, trafficRes] = await Promise.all([
          fetch(`${API}/api/traffic/summary`),
          fetch(`${API}/api/traffic`)
        ]);

        if (!summaryRes.ok || !trafficRes.ok) throw new Error('Failed to fetch data');

        setSummaryData(await summaryRes.json());
        setTrafficData(await trafficRes.json());
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
    </div>
  );
};

export default Dashboard;
