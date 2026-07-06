import React, { useEffect, useState, useRef } from 'react';
import { AlertTriangle, Clock, MapPin, ShieldCheck, FileText, Check, Loader2 } from 'lucide-react';
import ExplainabilityPanel from './ExplainabilityPanel';
import useCityStore from '../store/useCityStore';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draftingId, setDraftingId] = useState(null);
  const [draftedIds, setDraftedIds] = useState(new Set());
  const [sseAlerts, setSseAlerts] = useState([]);
  const eventSourceRef = useRef(null);

  const viewMode = useCityStore((s) => s.viewMode);

  // SSE connection for real-time alerts
  useEffect(() => {
    try {
      const API = import.meta.env.PUBLIC_API_URL || '';
      const es = new EventSource(`${API}/api/events`);
      eventSourceRef.current = es;

      es.addEventListener('alert', (e) => {
        try {
          const data = JSON.parse(e.data);
          setSseAlerts(prev => [data, ...prev].slice(0, 5));
        } catch {}
      });

      es.addEventListener('citizen_report', (e) => {
        try {
          const data = JSON.parse(e.data);
          setSseAlerts(prev => [{
            id: data.incident_id,
            route_name: data.ward,
            severity: data.severity,
            message: `Citizen report: ${data.notes}`,
            timestamp: data.timestamp,
            metrics: {},
            source: 'citizen',
          }, ...prev].slice(0, 5));
        } catch {}
      });

      return () => es.close();
    } catch {}
  }, []);

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

  // Auto-draft memo from anomaly
  const handleDraftMemo = async (alert) => {
    setDraftingId(alert.id);
    try {
      const API = import.meta.env.PUBLIC_API_URL || '';
      const res = await fetch(`${API}/api/actions/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route_name: alert.route_name,
          metric: 'congestion',
          value: alert.metrics?.congestion,
          severity: alert.severity,
          zscore: alert.explain?.sources?.[1]?.zscore || null,
          baseline: alert.explain?.sources?.[1]?.baseline || null,
          domain: 'mobility',
          description: alert.message,
          timestamp: alert.timestamp,
        }),
      });
      if (res.ok) {
        setDraftedIds(prev => new Set([...prev, alert.id]));
      }
    } catch (err) {
      console.error('Draft memo error:', err);
    } finally {
      setDraftingId(null);
    }
  };

  // Citizen-friendly message
  const citizenMessage = (alert) => {
    const cong = alert.metrics?.congestion;
    if (cong >= 90) return `Heavy traffic on ${alert.route_name} — consider alternate routes.`;
    if (cong >= 70) return `Moderate congestion on ${alert.route_name}. Expect some delays.`;
    return `Traffic advisory on ${alert.route_name}.`;
  };

  const allAlerts = [...sseAlerts, ...alerts];

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

  if (allAlerts.length === 0) {
    return (
      <div className="panel h-64 flex flex-col justify-center items-center text-center px-6">
        <div className="w-12 h-12 rounded-full grid place-items-center mb-3 border border-[#38BDF8]/30 bg-[#38BDF8]/12 text-[#38BDF8]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-[#38BDF8]">All Clear</h3>
        <p className="text-sm text-[#64748B] mt-1">
          {viewMode === 'citizen' ? 'No traffic issues right now.' : 'No anomalies in the network.'}
        </p>
      </div>
    );
  }

  // Citizen view: show top 3 with simplified language
  const displayAlerts = viewMode === 'citizen' ? allAlerts.slice(0, 3) : allAlerts;

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#FF5A5F]" />
          <h3 className="text-base font-semibold text-[#38BDF8]">
            {viewMode === 'citizen' ? 'Traffic Alerts' : 'Active Anomalies'}
          </h3>
        </div>
        <span className="mono text-xs px-2 py-0.5 rounded-full bg-[#FF5A5F]/12 text-[#FF9497] border border-[#FF5A5F]/25">{allAlerts.length}</span>
      </div>

      <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar">
        {displayAlerts.map(alert => {
          const critical = alert.severity === 'CRITICAL';
          const high = alert.severity === 'HIGH';
          const accent = critical ? '#FF5A5F' : high ? '#F97316' : '#FFB020';
          const isDrafted = draftedIds.has(alert.id);
          const isDrafting = draftingId === alert.id;

          return (
            <div key={alert.id} className="rounded-xl bg-[#0E141E] border border-[#1B2534] p-4 hover:border-[#FF5A5F]/50 transition-all hover:-translate-y-0.5 shadow-lg"
                 style={{ borderLeft: `3px solid ${accent}` }}>
              <div className="flex justify-between items-center mb-2">
                <span className="mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider"
                      style={{ background: `${accent}1f`, color: accent }}>
                  {viewMode === 'citizen'
                    ? (critical ? 'Severe' : high ? 'Caution' : 'Advisory')
                    : alert.severity}
                </span>
                <span className="flex items-center mono text-[11px] text-[#64748B]">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h4 className="font-semibold text-[#38BDF8] mb-1 flex items-center text-sm">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#64748B]" />
                {alert.route_name}
              </h4>
              <p className="text-sm text-[#9AA9BD] mb-3 leading-relaxed">
                {viewMode === 'citizen' ? citizenMessage(alert) : alert.message}
              </p>

              {/* Planner: show metrics */}
              {viewMode !== 'citizen' && alert.metrics && (
                <div className="flex items-center gap-2 mono text-[11px] mb-2">
                  {alert.metrics.congestion != null && (
                    <span className="px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]">
                      Congestion <span className="text-[#38BDF8]">{alert.metrics.congestion}</span>/100
                    </span>
                  )}
                  {alert.metrics.delay != null && (
                    <span className="px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]">
                      Delay <span className="text-[#38BDF8]">{alert.metrics.delay}</span>m
                    </span>
                  )}
                </div>
              )}

              {/* Auto-Draft Memo button for CRITICAL/HIGH alerts (planner only) */}
              {viewMode !== 'citizen' && (critical || high) && (
                <button
                  onClick={() => !isDrafted && handleDraftMemo(alert)}
                  disabled={isDrafting || isDrafted}
                  className={`mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    isDrafted
                      ? 'bg-[#10B981]/12 text-[#10B981] border border-[#10B981]/25 cursor-default'
                      : isDrafting
                      ? 'bg-[#F59E0B]/12 text-[#F59E0B] border border-[#F59E0B]/25'
                      : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/25 hover:bg-[#F59E0B]/20 cursor-pointer'
                  }`}
                >
                  {isDrafted ? (
                    <><Check className="w-3.5 h-3.5" /> Memo Drafted — View in Action Center</>
                  ) : isDrafting ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> AI Drafting Memo…</>
                  ) : (
                    <><FileText className="w-3.5 h-3.5" /> Auto-Draft Action Memo</>
                  )}
                </button>
              )}

              {/* Explainability — planner only */}
              {viewMode !== 'citizen' && alert.explain && (
                <ExplainabilityPanel explain={alert.explain} title="Why flagged?" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPanel;
