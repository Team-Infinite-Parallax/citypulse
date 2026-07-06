import React, { useEffect, useState } from 'react';
import { Cpu, Loader2, Sparkles, AlertCircle, Map, Shield, TestTube, Compass } from 'lucide-react';
import ExplainabilityPanel from './ExplainabilityPanel';

const PLAN_ICONS = {
  ideal_commute: Map,
  disaster_preparedness: Shield,
  simulate_impact: TestTube,
  tourism_hotspots: Compass,
};

const AgenticPlanner = () => {
  const [planTypes, setPlanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const API = import.meta.env.PUBLIC_API_URL || '';
        const res = await fetch(`${API}/api/plan/types`);
        if (res.ok) setPlanTypes(await res.json());
      } catch (err) {
        console.error('Failed to load plan types:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  const executePlan = async (planType) => {
    setExecuting(planType);
    setResult(null);
    setError(null);
    try {
      const API = import.meta.env.PUBLIC_API_URL || '';
      const res = await fetch(`${API}/api/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_type: planType }),
      });
      if (!res.ok) throw new Error('Planning workflow failed');
      setResult(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setExecuting(null);
    }
  };

  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-4 h-4 text-[#8B5CF6]" />
        <span className="eyebrow">AI Agent · Multi-Step Planning (ADK)</span>
      </div>

      {loading ? (
        <div className="h-32 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-[#38BDF8]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {planTypes.map(pt => {
            const Icon = PLAN_ICONS[pt.id] || Cpu;
            return (
              <button
                key={pt.id}
                onClick={() => executePlan(pt.id)}
                disabled={executing !== null}
                className={`p-4 rounded-xl border text-left transition-all ${
                  executing === pt.id
                    ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50'
                    : 'bg-[#0E141E] border-[#263244] hover:border-[#8B5CF6]/40 hover:-translate-y-0.5'
                } disabled:opacity-70`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-sm font-semibold text-[#38BDF8]">{pt.label}</span>
                  {executing === pt.id && <Loader2 className="w-3.5 h-3.5 animate-spin ml-auto text-[#8B5CF6]" />}
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">{pt.description}</p>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 text-[#FF9497] text-sm bg-[#FF5A5F]/10 p-3 rounded-xl border border-[#FF5A5F]/30">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {result && (
        <div className="mt-5 border-t border-[#263244] pt-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <span className="eyebrow">Planning Result</span>
          </div>

          <div className="bg-[#0E141E] rounded-xl p-4 border border-[#263244]">
            <p className="text-sm text-[#38BDF8] leading-relaxed">{result.summary}</p>
          </div>

          {result.top_choices && (
            <div className="space-y-2">
              {result.top_choices.map((choice, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#0E141E] p-3 rounded-xl border border-[#263244]">
                  <span className="text-[#64748B] font-mono text-xs w-5">#{i + 1}</span>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-[#38BDF8]">{choice.route}</span>
                    <p className="text-xs text-[#64748B] mt-0.5">{choice.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.priority_wards && (
            <div className="space-y-2">
              {result.priority_wards.map((w, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#0E141E] p-3 rounded-xl border border-[#263244]">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${w.risk_score >= 70 ? 'bg-[#FF5A5F]' : w.risk_score >= 40 ? 'bg-[#FFB020]' : 'bg-[#10B981]'}`} />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-[#38BDF8]">{w.ward}</span>
                    <span className="ml-2 text-xs text-[#64748B]">Risk: {w.risk_score}/100</span>
                    <p className="text-xs text-[#64748B] mt-0.5">{w.reason}</p>
                    {w.recommended_action && <p className="text-xs text-[#10B981] mt-1">→ {w.recommended_action}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.simulation && (
            <div className="space-y-2">
              {result.simulation.map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-[#0E141E] p-3 rounded-xl border border-[#263244] text-xs">
                  <span className="text-[#38BDF8] font-medium">{s.ward}</span>
                  <span className="text-[#64748B]">AQI: {s.current_aqi} → <span className="text-[#10B981]">{s.projected_aqi}</span> (↓{s.improvement})</span>
                </div>
              ))}
              {result.policy_recommendation && (
                <p className="text-xs text-[#FFB020] italic mt-2">Policy: {result.policy_recommendation}</p>
              )}
            </div>
          )}

          {result.top_hotspots && (
            <div className="space-y-2">
              {result.top_hotspots.map((h, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#0E141E] p-3 rounded-xl border border-[#263244]">
                  <span className="text-[#FFB020] font-mono text-xs w-5">#{h.rank}</span>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-[#38BDF8]">{h.name}</span>
                    <span className="ml-2 text-xs text-[#64748B]">Score: {h.potential_score}</span>
                    {h.recommendation && <p className="text-xs text-[#10B981] mt-0.5">→ {h.recommendation}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <ExplainabilityPanel
            explain={{
              confidence: 0.85,
              confidence_label: 'high',
              rationale: `Multi-step agentic workflow executed across ${result.plan_type} domain, synthesizing data from traffic, environment, public safety, tourism, and energy modules.`,
              sources: [{ plan_type: result.plan_type, executed_at: result.executed_at }],
              method: 'ADK-style agentic planning (multi-tool orchestration)',
            }}
            title="How this was planned"
          />
        </div>
      )}
    </div>
  );
};

export default AgenticPlanner;