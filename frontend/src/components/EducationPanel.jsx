import React, { useEffect, useState } from 'react';
import { GraduationCap, Users, BookOpen, TrendingUp, Sparkles, ChevronDown, ChevronUp, Star } from 'lucide-react';
import ExplainabilityPanel from './ExplainabilityPanel';

const categoryIcons = {
  digital_skills: '💻', tech_skills: '🤖', business: '💼', environment: '🌿',
  safety: '🛡️', agriculture: '🌱', life_skills: '🗣️', financial: '💰',
  health: '❤️',
};

const EducationPanel = () => {
  const [programs, setPrograms] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRecs, setShowRecs] = useState(false);
  const [recsLoading, setRecsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API = import.meta.env.PUBLIC_API_URL || '';
        const [progsRes, statsRes] = await Promise.all([
          fetch(`${API}/api/education/programs`),
          fetch(`${API}/api/education/stats`),
        ]);
        if (progsRes.ok) setPrograms(await progsRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (err) {
        console.error('Education fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const loadRecommendations = async () => {
    if (recommendations) { setShowRecs(!showRecs); return; }
    setRecsLoading(true);
    setShowRecs(true);
    try {
      const API = import.meta.env.PUBLIC_API_URL || '';
      const res = await fetch(`${API}/api/education/recommendations`);
      if (res.ok) setRecommendations(await res.json());
    } catch (err) {
      console.error('Recommendations fetch error:', err);
    } finally {
      setRecsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="panel h-48 flex flex-col justify-center items-center gap-3" aria-live="polite">
        <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
        <span className="eyebrow">Loading education data…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary KPIs */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              <span className="eyebrow">Programs</span>
            </div>
            <span className="stat text-2xl text-[#8B5CF6]">{stats.summary.total_programs}</span>
            <p className="mono text-[11px] text-[#8896A8] mt-1">active programs</p>
          </div>
          <div className="panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#10B981]" />
              <span className="eyebrow">Enrolled</span>
            </div>
            <span className="stat text-2xl text-[#10B981]">{stats.summary.total_enrolled}</span>
            <p className="mono text-[11px] text-[#8896A8] mt-1">learners</p>
          </div>
          <div className="panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
              <span className="eyebrow">Utilization</span>
            </div>
            <span className="stat text-2xl text-[#38BDF8]">{stats.summary.overall_utilization_pct}%</span>
            <p className="mono text-[11px] text-[#8896A8] mt-1">capacity used</p>
          </div>
          <div className="panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 text-[#F59E0B]" />
              <span className="eyebrow">Categories</span>
            </div>
            <span className="stat text-2xl text-[#F59E0B]">{stats.summary.categories.length}</span>
            <p className="mono text-[11px] text-[#8896A8] mt-1">skill areas</p>
          </div>
        </div>
      )}

      {/* Programs grid */}
      <div className="panel">
        <div className="panel-head">
          <h3 className="text-base font-semibold text-[#8B5CF6]">Community Learning Programs</h3>
          <span className="eyebrow">{programs.length} active</span>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {programs.slice(0, 8).map(p => (
            <div key={p.id} className="bg-[#0E141E] rounded-xl p-4 border border-[#1B2534] hover:border-[#8B5CF6]/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[p.category] || '📚'}</span>
                  <h4 className="text-sm font-medium text-[#E2E8F0] leading-tight">{p.title}</h4>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <Star className="w-3 h-3 text-[#F59E0B]" />
                  <span className="text-xs text-[#F59E0B] font-medium">{p.rating}</span>
                </div>
              </div>
              <p className="text-xs text-[#8896A8] mb-2">{p.provider} · {p.ward}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#64748B]">{p.schedule}</span>
                <span className="text-[#10B981]">{p.enrolled}/{p.capacity} enrolled</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.skills_covered.slice(0, 3).map(skill => (
                  <span key={skill} className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">{skill}</span>
                ))}
                {p.skills_covered.length > 3 && <span className="text-[10px] text-[#64748B]">+{p.skills_covered.length - 3}</span>}
              </div>
              {/* Impact badge */}
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full bg-[#1B2534] overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${p.impact_score}%`, background: p.impact_score >= 85 ? '#10B981' : p.impact_score >= 70 ? '#F59E0B' : '#64748B' }} />
                </div>
                <span className="text-[10px] text-[#64748B] mono">{p.impact_score}/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="panel">
        <button
          onClick={loadRecommendations}
          className="w-full panel-head cursor-pointer hover:bg-[#1B2534]/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFB020]" />
            <h3 className="text-base font-semibold text-[#FFB020]">AI Learning Recommendations</h3>
          </div>
          {showRecs ? <ChevronUp className="w-4 h-4 text-[#64748B]" /> : <ChevronDown className="w-4 h-4 text-[#64748B]" />}
        </button>

        {showRecs && (
          <div className="p-4">
            {recsLoading ? (
              <div className="flex items-center gap-3 py-6 justify-center">
                <div className="w-5 h-5 border-2 border-[#FFB020] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-[#8896A8]">Generating cross-domain recommendations…</span>
              </div>
            ) : recommendations ? (
              <div className="space-y-3">
                <p className="text-sm text-[#8896A8] mb-4">{recommendations.summary}</p>
                {(recommendations.recommendations || []).map((rec, i) => (
                  <div key={i} className="bg-[#0E141E] rounded-xl p-4 border border-[#FFB020]/20">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rec.priority === 'HIGH' ? 'bg-[#FF5A5F]/15 text-[#FF5A5F]' : 'bg-[#F59E0B]/15 text-[#F59E0B]'}`}>
                        {rec.priority}
                      </span>
                      <span className="text-xs text-[#64748B]">{rec.ward}</span>
                    </div>
                    <h4 className="text-sm font-medium text-[#E2E8F0] mt-1">{rec.program_title}</h4>
                    <p className="text-xs text-[#8896A8] mt-1">{rec.reason}</p>
                    <p className="text-[10px] text-[#64748B] mt-1">Target: {rec.target_audience}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#64748B]">Unable to load recommendations.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationPanel;
