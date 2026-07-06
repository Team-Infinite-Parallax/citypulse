import React, { useEffect, useState } from 'react';
import { Zap, Droplets, Sun, TrendingUp, AlertCircle } from 'lucide-react';

const EnergyPanel = () => {
  const [energy, setEnergy] = useState([]);
  const [water, setWater] = useState([]);
  const [efficiency, setEfficiency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API = import.meta.env.PUBLIC_API_URL || '';
        const [energyRes, waterRes, effRes] = await Promise.all([
          fetch(`${API}/api/energy/energy`),
          fetch(`${API}/api/energy/water`),
          fetch(`${API}/api/energy/efficiency`),
        ]);
        if (!energyRes.ok) throw new Error('Failed to load utility data');
        setEnergy(await energyRes.json());
        if (waterRes.ok) setWater(await waterRes.json());
        if (effRes.ok) setEfficiency(await effRes.json());
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="panel h-48 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel p-5 text-[#FF9497] flex items-center gap-2">
        <AlertCircle className="w-5 h-5" /> {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {efficiency && (
        <div className="panel p-5 border-l-4" style={{ borderLeftColor: '#F59E0B' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
            <span className="eyebrow">Smart Utilities — AI Assessment</span>
          </div>
          <p className="text-sm text-[#38BDF8] leading-relaxed">{efficiency.interpretation}</p>
          <div className="flex gap-4 mt-3 text-xs text-[#8896A8]">
            <span>☀️ Solar: {efficiency.avg_solar_adoption_pct}%</span>
            <span>🌿 Green: {efficiency.avg_green_energy_pct}%</span>
            <span>💧 Water loss: {efficiency.avg_water_loss_pct}%</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {energy.map(e => {
          const wData = water.find(w => w.ward === e.ward);
          return (
            <div key={e.ward} className="panel p-4 hover:border-[#38BDF8]/30 transition-colors">
              <h4 className="font-semibold text-[#38BDF8] text-sm mb-3">{e.ward}</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-[#8896A8]"><Zap className="w-3 h-3" /> Consumption</span>
                  <span className="text-[#38BDF8] font-mono">{(e.avg_kwh_per_month / 1000).toFixed(0)}k kWh/mo</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-[#8896A8]"><Sun className="w-3 h-3" /> Solar adoption</span>
                  <span className="text-[#10B981] font-mono">{e.solar_adoption_pct}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-[#8896A8]">Green energy</span>
                  <span className="text-[#10B981] font-mono">{e.green_pct}%</span>
                </div>
                {wData && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-[#8896A8]"><Droplets className="w-3 h-3" /> Water quality</span>
                      <span className="text-[#38BDF8] font-mono">{wData.water_quality_index}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-[#8896A8]">Water loss</span>
                      <span className="text-[#FF5A5F] font-mono">{wData.loss_pct}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {efficiency && (
        <div className="panel p-4">
          <h4 className="font-semibold text-[#38BDF8] text-sm mb-3">Ward Efficiency Rankings</h4>
          <div className="space-y-2">
            {efficiency.ward_rankings.map((w, i) => (
              <div key={w.ward} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-[#0E141E]">
                <span className="flex items-center gap-2">
                  <span className="text-[#64748B] font-mono">#{i + 1}</span>
                  <span className="text-[#38BDF8]">{w.ward}</span>
                </span>
                <span className={`font-mono ${
                  w.efficiency_score >= 70 ? 'text-[#10B981]' : w.efficiency_score >= 50 ? 'text-[#FFB020]' : 'text-[#FF5A5F]'
                }`}>{w.efficiency_score}/100</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyPanel;