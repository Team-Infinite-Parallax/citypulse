import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock, MapPin, ShieldCheck } from 'lucide-react';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const API = import.meta.env.PUBLIC_API_URL || '';
        const res = await fetch(`${API}/api/alerts`);
        if (!res.ok) throw new Error('Failed to fetch alerts');
        setAlerts(await res.json());
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
      <div className="panel h-64 flex flex-col justify-center items-center gap-3" aria-live="polite">
        <div className="w-8 h-8 border-2 border-[#FF5A5F] border-t-transparent rounded-full animate-spin"></div>
        <span className="eyebrow">Scanning for anomalies…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel p-5 flex items-center text-[#FF9497] border-[#FF5A5F]/30" aria-live="assertive">
        <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
        <p className="font-semibold text-sm">{error}</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="panel h-64 flex flex-col justify-center items-center text-center px-6">
        <div className="w-12 h-12 rounded-full grid place-items-center mb-3 border border-[#31D0AA]/30 bg-[#31D0AA]/12 text-[#31D0AA]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-[#E6EDF3]">All Clear</h3>
        <p className="text-sm text-[#64748B] mt-1">No anomalies in the network.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#FF5A5F]" />
          <h3 className="text-base font-semibold text-[#E6EDF3]">Active Anomalies</h3>
        </div>
        <span className="mono text-xs px-2 py-0.5 rounded-full bg-[#FF5A5F]/12 text-[#FF9497] border border-[#FF5A5F]/25">{alerts.length}</span>
      </div>

      <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar">
        {alerts.map(alert => {
          const critical = alert.severity === 'CRITICAL';
          const accent = critical ? '#FF5A5F' : '#FFB020';
          return (
            <div key={alert.id} className="rounded-xl bg-[#0E141E] border border-[#1B2534] p-4 hover:border-[#FF5A5F]/50 transition-colors shadow-lg"
                 style={{ borderLeft: `3px solid ${accent}` }}>
              <div className="flex justify-between items-center mb-2">
                <span className="mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider"
                      style={{ background: `${accent}1f`, color: accent }}>
                  {alert.severity}
                </span>
                <span className="flex items-center mono text-[11px] text-[#64748B]">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h4 className="font-semibold text-[#E6EDF3] mb-1 flex items-center text-sm">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#64748B]" />
                {alert.route_name}
              </h4>
              <p className="text-sm text-[#9AA9BD] mb-3 leading-relaxed">{alert.message}</p>

              <div className="flex items-center gap-2 mono text-[11px]">
                <span className="px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]">
                  Congestion <span className="text-[#E6EDF3]">{alert.metrics.congestion}</span>/100
                </span>
                <span className="px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]">
                  Delay <span className="text-[#E6EDF3]">{alert.metrics.delay}</span>m
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPanel;
