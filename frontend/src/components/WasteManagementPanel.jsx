import React, { useEffect, useState } from 'react';
import { Trash2, Droplets, Recycle, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import ExplainabilityPanel from './ExplainabilityPanel';

const scoreColor = (score) => {
  if (score >= 80) return '#10B981'; // Green
  if (score >= 60) return '#F59E0B'; // Yellow/Amber
  return '#EF4444'; // Red
};

const WasteManagementPanel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API = import.meta.env.PUBLIC_API_URL || '';
        const res = await fetch(`${API}/api/waste/summary`);
        if (!res.ok) throw new Error('Failed to fetch waste management data');
        setData(await res.json());
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
      <div className="panel p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#10B981]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel p-6 flex items-center gap-3 text-[#FF9497] border-[#EF4444]/30">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  // Display top 3 wards requiring attention (lowest efficiency)
  const displayWards = data.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayWards.map((ward, i) => (
          <div key={ward.ward} className="panel p-5 relative overflow-hidden group">
            {/* Background gradient hint */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity duration-500"
              style={{ background: scoreColor(ward.waste_efficiency) }}
            />
            
            <div className="flex items-center justify-between mb-4 relative">
              <h3 className="text-lg font-semibold text-[#E2E8F0]">{ward.ward}</h3>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#64748B]">
                <span>Priority</span>
                <span className="text-[#E2E8F0] bg-[#1B2534] px-1.5 py-0.5 rounded">#{i + 1}</span>
              </div>
            </div>

            <div className="space-y-4 relative">
              {/* Waste Efficiency */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-1.5 text-[#8896A8]">
                    <Trash2 className="w-4 h-4" />
                    <span>Collection Efficiency</span>
                  </div>
                  <span className="font-semibold" style={{ color: scoreColor(ward.waste_efficiency) }}>
                    {ward.waste_efficiency}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#0E141E] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${ward.waste_efficiency}%`,
                      backgroundColor: scoreColor(ward.waste_efficiency)
                    }} 
                  />
                </div>
              </div>

              {/* Water Quality */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-1.5 text-[#8896A8]">
                    <Droplets className="w-4 h-4" />
                    <span>Water Quality Index</span>
                  </div>
                  <span className="font-semibold" style={{ color: scoreColor(ward.water_quality) }}>
                    {ward.water_quality}/100
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#0E141E] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${ward.water_quality}%`,
                      backgroundColor: scoreColor(ward.water_quality)
                    }} 
                  />
                </div>
              </div>

              {/* Recycling Rate */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-1.5 text-[#8896A8]">
                    <Recycle className="w-4 h-4" />
                    <span>Estimated Recycling</span>
                  </div>
                  <span className="font-semibold text-[#38BDF8]">
                    {ward.recycling_rate}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#0E141E] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#38BDF8]" 
                    style={{ width: `${ward.recycling_rate}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="mt-5 p-3 rounded-lg bg-[#1B2534]/50 border border-[#263244] relative">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#8B5CF6] mt-0.5 shrink-0" />
                <p className="text-xs text-[#E2E8F0] leading-relaxed">
                  {ward.recommendation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ExplainabilityPanel
        explain={{
          confidence: 0.88,
          confidence_label: 'high',
          rationale: 'Generated by analyzing recent ward-level waste collection efficiency and water quality data via Gemini.',
          sources: data.map(d => ({ ward: d.ward, waste: d.waste_efficiency, water: d.water_quality })),
          method: 'Gemini RAG (Cross-domain synthesis)',
        }}
        title="Why these recommendations?"
      />
    </div>
  );
};

export default WasteManagementPanel;
