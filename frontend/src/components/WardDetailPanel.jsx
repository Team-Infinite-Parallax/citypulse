import React, { useEffect, useState } from 'react';
import { AlertCircle, Leaf, ShieldAlert, Trash2 } from 'lucide-react';
import useCityStore from '../store/useCityStore';

const livabilityEmoji = (score) => score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴';
const livabilityWord = (score) => score >= 80 ? 'Great' : score >= 60 ? 'Okay' : 'Needs Work';

const WardDetailPanel = () => {
  const viewMode = useCityStore((s) => s.viewMode);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLivability = async () => {
      try {
        setLoading(true);
        const API = import.meta.env.PUBLIC_API_URL || '';
        const res = await fetch(`${API}/api/environment/livability`);
        if (!res.ok) throw new Error('Failed to fetch livability data');
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load ward livability scores.');
      } finally {
        setLoading(false);
      }
    };
    fetchLivability();
  }, []);

  if (loading) {
    return (
      <div className="panel p-6 flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel p-6 text-[#FF9497] flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  if (viewMode === 'citizen') {
    return (
      <div className="space-y-3">
        <p className="eyebrow mb-2">My Neighborhood</p>
        {data.map((ward) => (
          <div key={ward.ward} className="panel p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-[#38BDF8]">{ward.ward}</h3>
              <span className="text-lg">{livabilityEmoji(ward.livability_score)} {livabilityWord(ward.livability_score)}</span>
            </div>
            <p className="text-sm text-[#8896A8] leading-relaxed">{ward.interpretation}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((ward) => (
        <div key={ward.ward} className="panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-[#38BDF8]">{ward.ward}</h3>
            <div className="flex items-center gap-2">
              <span className="eyebrow text-[#38BDF8]">Livability Score</span>
              <span className={`px-2 py-1 rounded text-sm font-bold ${
                ward.livability_score >= 80 ? 'bg-[#10b981]/20 text-[#10b981]' :
                ward.livability_score >= 60 ? 'bg-[#f97316]/20 text-[#f97316]' :
                'bg-[#ef4444]/20 text-[#ef4444]'
              }`}>
                {ward.livability_score}/100
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#8896A8] text-xs uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5" />
                AQI
              </div>
              <span className="text-xl font-semibold text-[#38BDF8]">{ward.aqi}</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#8896A8] text-xs uppercase tracking-wider">
                <Trash2 className="w-3.5 h-3.5" />
                Waste Eff.
              </div>
              <span className="text-xl font-semibold text-[#38BDF8]">{ward.waste_efficiency}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#8896A8] text-xs uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                Incidents
              </div>
              <span className="text-xl font-semibold text-[#38BDF8]">{ward.incident_rate}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#263244]">
            <p className="text-sm text-[#8896A8] italic">
              " {ward.interpretation} "
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WardDetailPanel;
