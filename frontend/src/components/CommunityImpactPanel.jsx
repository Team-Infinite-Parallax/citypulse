import React, { useEffect, useState } from 'react';
import { Heart, Shield, Users, HandHelping, TrendingDown, Sparkles, AlertTriangle } from 'lucide-react';

const sviColor = (score) => score >= 60 ? '#FF5A5F' : score >= 40 ? '#F59E0B' : '#10B981';
const sviLabel = (score) => score >= 60 ? 'High Vulnerability' : score >= 40 ? 'Moderate' : 'Resilient';

const CommunityImpactPanel = () => {
  const [impact, setImpact] = useState(null);
  const [vulnerability, setVulnerability] = useState(null);
  const [programs, setPrograms] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API = import.meta.env.PUBLIC_API_URL || '';
        const [impactRes, vulnRes, progsRes] = await Promise.all([
          fetch(`${API}/api/community/impact`),
          fetch(`${API}/api/community/vulnerability`),
          fetch(`${API}/api/community/programs`),
        ]);
        if (impactRes.ok) setImpact(await impactRes.json());
        if (vulnRes.ok) setVulnerability(await vulnRes.json());
        if (progsRes.ok) setPrograms(await progsRes.json());
      } catch (err) {
        console.error('Community fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="panel h-48 flex flex-col justify-center items-center gap-3" aria-live="polite">
        <div className="w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
        <span className="eyebrow">Loading community data…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Impact KPIs */}
      {impact && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <HandHelping className="w-4 h-4 text-[#10B981]" />
              <span className="eyebrow">Volunteers</span>
            </div>
            <span className="stat text-2xl text-[#10B981]">{impact.total_volunteers_active}</span>
            <p className="mono text-[11px] text-[#8896A8] mt-1">active across {impact.volunteer_programs} programs</p>
          </div>
          <div className="panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#38BDF8]" />
              <span className="eyebrow">Services</span>
            </div>
            <span className="stat text-2xl text-[#38BDF8]">{impact.social_services}</span>
            <p className="mono text-[11px] text-[#8896A8] mt-1">social services</p>
          </div>
          <div className="panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#F59E0B]" />
              <span className="eyebrow">Fill Rate</span>
            </div>
            <span className="stat text-2xl text-[#F59E0B]">{impact.volunteer_fill_rate_pct}%</span>
            <p className="mono text-[11px] text-[#8896A8] mt-1">volunteer positions filled</p>
          </div>
          <div className="panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-[#8B5CF6]" />
              <span className="eyebrow">Categories</span>
            </div>
            <span className="stat text-2xl text-[#8B5CF6]">{impact.categories.length}</span>
            <p className="mono text-[11px] text-[#8896A8] mt-1">impact areas</p>
          </div>
        </div>
      )}

      {/* AI Impact Summary */}
      {impact?.interpretation && (
        <div className="panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
            <span className="eyebrow">AI Impact Assessment</span>
          </div>
          <p className="text-sm text-[#8896A8] leading-relaxed">{impact.interpretation}</p>
        </div>
      )}

      {/* Social Vulnerability Index */}
      {vulnerability && (
        <div className="panel">
          <div className="panel-head">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <h3 className="text-base font-semibold text-[#F59E0B]">Social Vulnerability Index</h3>
            </div>
            <span className="eyebrow">Cross-domain composite</span>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-[#64748B] mb-3">{vulnerability.methodology}</p>
            {vulnerability.wards.map(w => (
              <div key={w.ward} className="bg-[#0E141E] rounded-xl p-4 border border-[#1B2534]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-[#E2E8F0]">{w.ward}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${sviColor(w.svi)}15`, color: sviColor(w.svi) }}>
                      {sviLabel(w.svi)}
                    </span>
                    <span className="stat text-lg" style={{ color: sviColor(w.svi) }}>{w.svi}</span>
                  </div>
                </div>
                {/* Component breakdown */}
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {Object.entries(w.components).map(([key, comp]) => (
                    <div key={key} className="text-center">
                      <div className="h-1 rounded-full bg-[#1B2534] overflow-hidden mb-1">
                        <div className="h-full rounded-full" style={{ width: `${comp.score}%`, background: comp.score >= 60 ? '#FF5A5F' : comp.score >= 30 ? '#F59E0B' : '#10B981' }} />
                      </div>
                      <span className="text-[10px] text-[#64748B] capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {vulnerability.interpretation && (
              <div className="mt-3 p-3 rounded-lg bg-[#FFB020]/5 border border-[#FFB020]/15">
                <p className="text-xs text-[#8896A8]">
                  <Sparkles className="w-3 h-3 text-[#FFB020] inline mr-1" />
                  {vulnerability.interpretation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Volunteer Programs & Social Services */}
      {programs && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="panel">
            <div className="panel-head">
              <h3 className="text-base font-semibold text-[#10B981]">Volunteer Programs</h3>
              <span className="eyebrow">{programs.volunteer_programs.length} active</span>
            </div>
            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {programs.volunteer_programs.map(v => (
                <div key={v.id} className="bg-[#0E141E] rounded-lg p-3 border border-[#1B2534] hover:border-[#10B981]/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-[#E2E8F0]">{v.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">{v.category}</span>
                  </div>
                  <p className="text-xs text-[#8896A8]">{v.organizer} · {v.ward}</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-[#64748B]">{v.schedule}</span>
                    <span className="text-[#10B981]">{v.volunteers_registered}/{v.volunteers_needed} volunteers</span>
                  </div>
                  <p className="text-[10px] text-[#64748B] mt-1">{v.impact_metric}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-head">
              <h3 className="text-base font-semibold text-[#38BDF8]">Social Services</h3>
              <span className="eyebrow">{programs.social_services.length} available</span>
            </div>
            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {programs.social_services.map(s => (
                <div key={s.id} className="bg-[#0E141E] rounded-lg p-3 border border-[#1B2534] hover:border-[#38BDF8]/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-[#E2E8F0]">{s.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">{s.category}</span>
                  </div>
                  <p className="text-xs text-[#8896A8]">{s.provider} · {s.ward}</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-[#64748B]">{s.availability}</span>
                    <span className="text-[#38BDF8]">{s.capacity}</span>
                  </div>
                  <p className="text-[10px] text-[#64748B] mt-1">📞 {s.contact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityImpactPanel;
