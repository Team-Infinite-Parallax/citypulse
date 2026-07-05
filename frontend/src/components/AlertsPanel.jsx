import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock, MapPin, Activity } from 'lucide-react';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3001/api/alerts');
        if (!res.ok) throw new Error('Failed to fetch alerts');
        const data = await res.json();
        setAlerts(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load alerts.');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 h-64 flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm font-medium text-slate-600">Scanning for anomalies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-5 rounded-2xl border border-red-100 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-3" />
        <p className="font-semibold text-sm">{error}</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 h-64 flex flex-col justify-center items-center">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-slate-800">All Clear</h3>
        <p className="text-sm text-slate-500 mt-1">No anomalies detected in the network.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
        Active Anomalies ({alerts.length})
      </h3>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {alerts.map(alert => (
          <div 
            key={alert.id} 
            className={`p-4 rounded-xl border-l-4 ${alert.severity === 'CRITICAL' ? 'bg-red-50 border-red-500 text-red-900' : 'bg-orange-50 border-orange-500 text-orange-900'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                {alert.severity}
              </span>
              <div className="flex items-center text-xs opacity-75 font-medium">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(alert.timestamp).toLocaleString()}
              </div>
            </div>
            
            <h4 className="font-semibold mb-1 flex items-center">
              <MapPin className="w-4 h-4 mr-1 opacity-70" />
              {alert.route_name}
            </h4>
            <p className="text-sm opacity-90 mb-3">{alert.message}</p>
            
            <div className="flex items-center gap-4 text-sm font-medium opacity-80">
              <span className="bg-white/50 px-2 py-1 rounded">Congestion: {alert.metrics.congestion}/100</span>
              <span className="bg-white/50 px-2 py-1 rounded">Delay: {alert.metrics.delay}m</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;
