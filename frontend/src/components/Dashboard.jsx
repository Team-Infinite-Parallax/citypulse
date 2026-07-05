import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import useCityStore from '../store/useCityStore';
import { AlertCircle, Clock, Activity, Gauge } from 'lucide-react';

// Night Dispatch palette
const FLOW = '#31D0AA', AMBER = '#FFB020', STOP = '#FF5A5F';

// congestion score -> status color (shared by KPI + charts)
const scoreColor = (v) => (v >= 70 ? STOP : v >= 40 ? AMBER : FLOW);

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

  const selectedRoute = useCityStore((state) => state.selectedRoute);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, trafficRes] = await Promise.all([
          fetch('http://localhost:3001/api/traffic/summary'),
          fetch('http://localhost:3001/api/traffic')
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

  // Filter by selected route
  const displaySummary = selectedRoute
    ? summaryData.filter(s => s.route_name === selectedRoute)
    : summaryData;
  const displayTraffic = selectedRoute
    ? trafficData.filter(t => t.route_name === selectedRoute)
    : trafficData;

  // Avg Delay by Route (bar)
  const delayChartData = summaryData.map(s => ({ name: s.route_name, Delay: s.avg_delay_minutes }));

  // Congestion trend over time (area)
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

  // KPIs
  const overallAvgCongestion = Math.round(displaySummary.reduce((a, s) => a + s.avg_congestion, 0) / displaySummary.length) || 0;
  const overallAvgDelay = Math.round(displaySummary.reduce((a, s) => a + s.avg_delay_minutes, 0) / displaySummary.length) || 0;
  const peakHour = displaySummary.length === 1 ? displaySummary[0].peak_hour : 'Var';

  const congColor = scoreColor(overallAvgCongestion);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Congestion — with load meter */}
        <div className="panel p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Avg Congestion</span>
            <div className="w-8 h-8 rounded-lg grid place-items-center border"
                 style={{ background: `${congColor}1f`, borderColor: `${congColor}44`, color: congColor }}>
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="stat text-4xl" style={{ color: congColor }}>{overallAvgCongestion}</span>
            <span className="text-[#64748B] text-sm">/100</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-[#0E141E] overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${overallAvgCongestion}%`, background: congColor }} />
          </div>
        </div>

        {/* Avg Delay */}
        <div className="panel p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Avg Delay</span>
            <div className="w-8 h-8 rounded-lg grid place-items-center border border-[#FFB020]/30 bg-[#FFB020]/12 text-[#FFB020]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="stat text-4xl text-[#E6EDF3]">{overallAvgDelay}</span>
            <span className="text-[#64748B] text-sm">min</span>
          </div>
          <p className="mono text-[11px] text-[#64748B] mt-3">vs. free-flow baseline</p>
        </div>

        {/* Peak Hour */}
        <div className="panel p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Peak Hour</span>
            <div className="w-8 h-8 rounded-lg grid place-items-center border border-[#31D0AA]/30 bg-[#31D0AA]/12 text-[#31D0AA]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="stat text-4xl text-[#E6EDF3]">{peakHour}</span>
          </div>
          <p className="mono text-[11px] text-[#64748B] mt-3">busiest window</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="panel">
          <div className="panel-head">
            <h3 className="text-base font-semibold text-[#E6EDF3]">Congestion Trend · 24h</h3>
            <span className="eyebrow">{selectedRoute || 'All corridors'}</span>
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
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickMargin={8} minTickGap={30} tickLine={false} axisLine={{ stroke: '#1B2534' }} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
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
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickMargin={8} tickLine={false} axisLine={{ stroke: '#1B2534' }} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={tooltipStyle} />
                <Bar dataKey="Delay" fill={AMBER} radius={[4, 4, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
