import React, { useEffect, useState } from 'react';
import { HeartPulse, Wind, AlertCircle, ShieldCheck, Users } from 'lucide-react';

// Risk level -> accent color (matches Night Dispatch palette)
const riskColor = (level) => ({
  LOW: '#31D0AA',
  MODERATE: '#FFB020',
  ELEVATED: '#FF9F1C',
  HIGH: '#FF5A5F',
  SEVERE: '#FF3B5C',
}[level] || '#9AA9BD');

const HealthAdvisory = () => {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvisories = async () => {
      try {
        setLoading(true);
        const API = import.meta.env.PUBLIC_API_URL || '';
        const res = await fetch(`${API}/api/advisories`);
        if (!res.ok) throw new Error('Failed to fetch advisories');
        setAdvisories(await res.json());
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load health advisories.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisories();
  }, []);

  if (loading) {
    return (
      <div className="panel h-64 flex flex-col justify-center items-center gap-3" aria-live="polite">
        <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
        <span className="eyebrow">Cross-referencing AQI &amp; congestion…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel p-5 flex items-center text-[#FF9497] border-[#FF5A5F]/30" aria-live="assertive">
        <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
        <p className="font-semibold text-sm">{error}</p>
      </div>
    );
  }

  const actionable = advisories.filter((a) => a.risk_level !== 'LOW');

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-head">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-[#8B5CF6]" />
          <h3 className="text-base font-semibold text-[#E6EDF3]">Health &amp; Air-Quality Advisories</h3>
        </div>
        <span className="mono text-xs px-2 py-0.5 rounded-full bg-[#8B5CF6]/12 text-[#C4B5FD] border border-[#8B5CF6]/25">
          {actionable.length} active
        </span>
      </div>

      <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar flex-grow">
        {advisories.length === 0 && (
          <div className="h-40 flex flex-col justify-center items-center text-center">
            <ShieldCheck className="w-8 h-8 text-[#31D0AA] mb-2" />
            <p className="text-sm text-[#9AA9BD]">No air-quality data available.</p>
          </div>
        )}

        {advisories.map((a) => {
          const accent = riskColor(a.risk_level);
          return (
            <div
              key={a.id}
              className="rounded-xl bg-[#0E141E] border border-[#1B2534] p-4 shadow-lg"
              style={{ borderLeft: `3px solid ${accent}` }}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-[#E6EDF3] text-sm">{a.route_name}</h4>
                <span
                  className="mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider"
                  style={{ background: `${accent}1f`, color: accent }}
                >
                  {a.risk_level}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3 mono text-[11px]">
                <span className="px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD] flex items-center gap-1">
                  <Wind className="w-3 h-3" /> AQI <span className="text-[#E6EDF3]">{a.peak_aqi}</span>
                </span>
                <span className="px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]">
                  {a.aqi_category}
                </span>
                <span className="px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]">
                  Cong <span className="text-[#E6EDF3]">{a.peak_congestion}</span>/100
                </span>
              </div>

              <p className="text-sm text-[#9AA9BD] leading-relaxed mb-3">{a.advisory}</p>

              <div className="flex items-start gap-1.5 text-[11px] text-[#64748B]">
                <Users className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>{a.vulnerable_groups.join(' · ')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthAdvisory;
