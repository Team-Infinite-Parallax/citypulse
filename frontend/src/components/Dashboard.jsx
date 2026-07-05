import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import useCityStore from '../store/useCityStore';
import { AlertCircle, Clock, Activity } from 'lucide-react';

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
        
        const summary = await summaryRes.json();
        const traffic = await trafficRes.json();
        
        setSummaryData(summary);
        setTrafficData(traffic);
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
      <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-slate-600 font-medium">Loading Dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 shadow-sm flex items-center">
        <AlertCircle className="w-6 h-6 mr-3" />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  // Filter data based on selected route
  const displaySummary = selectedRoute 
    ? summaryData.filter(s => s.route_name === selectedRoute)
    : summaryData;
    
  const displayTraffic = selectedRoute
    ? trafficData.filter(t => t.route_name === selectedRoute)
    : trafficData;

  // Process data for charts
  // 1. Average Delay by Route (Bar Chart)
  const delayChartData = summaryData.map(s => ({
    name: s.route_name,
    Delay: s.avg_delay_minutes
  }));

  // 2. Congestion Trend over time (Line Chart)
  // Get last 24 hours of data for trend
  const sortedTraffic = [...displayTraffic].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const trendDataRaw = {};
  sortedTraffic.forEach(t => {
    const time = new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!trendDataRaw[time]) {
      trendDataRaw[time] = { time, congestion: 0, count: 0 };
    }
    trendDataRaw[time].congestion += t.congestion;
    trendDataRaw[time].count += 1;
  });
  
  const trendData = Object.values(trendDataRaw)
    .map(d => ({ time: d.time, Congestion: Math.round(d.congestion / d.count) }))
    .slice(-24); // Show last 24 points (hours)

  // Top KPIs
  const overallAvgCongestion = Math.round(displaySummary.reduce((acc, s) => acc + s.avg_congestion, 0) / displaySummary.length) || 0;
  const overallAvgDelay = Math.round(displaySummary.reduce((acc, s) => acc + s.avg_delay_minutes, 0) / displaySummary.length) || 0;
  const peakHour = displaySummary.length === 1 ? displaySummary[0].peak_hour : "Var"; // Varied if all selected

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Avg Congestion</p>
            <p className="text-2xl font-bold text-slate-900">{overallAvgCongestion}/100</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg mr-4">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Avg Delay</p>
            <p className="text-2xl font-bold text-slate-900">{overallAvgDelay} min</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg mr-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Peak Hour</p>
            <p className="text-2xl font-bold text-slate-900">{peakHour}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Congestion Trend (Last 24h) {selectedRoute ? `- ${selectedRoute}` : ''}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickMargin={10} minTickGap={30} />
                <YAxis stroke="#64748b" fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="Congestion" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Avg Delay by Route</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickMargin={10} />
                <YAxis stroke="#64748b" fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="Delay" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
