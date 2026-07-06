import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Gauge, Database } from 'lucide-react';

// One reusable "Why this answer?" panel attached under every AI-generated output
// (chat answers, recommendations, anomaly alerts). It surfaces the REAL data the
// system used: a confidence/relevance score, a one-sentence rationale, the
// retrieved/evidence sources, and the retrieval/detection method — no placeholders.

const LABEL_COLOR = { high: '#38BDF8', medium: '#FFB020', low: '#8896A8' };

const SourceRow = ({ source }) => {
  // Retrieval sources: { route_name/ward, similarity, summary }.
  if (source && typeof source === 'object' && ('similarity' in source)) {
    const name = source.route_name || source.ward || source.key || 'source';
    return (
      <div className="flex items-center justify-between gap-2 bg-[#0E141E] px-3 py-2 rounded-lg border border-[#1B2534]">
        <span className="text-xs text-[#38BDF8] font-medium truncate">{name}</span>
        <span className="mono text-[11px] text-[#38BDF8] flex-shrink-0">
          sim {Number(source.similarity).toFixed(3)}
        </span>
      </div>
    );
  }
  // Everything else: compact JSON of the underlying record.
  return (
    <pre className="text-[11px] font-mono bg-[#0E141E] p-2.5 rounded-lg overflow-x-auto text-[#9AA9BD] border border-[#1B2534] custom-scrollbar">
      {JSON.stringify(source, null, 2)}
    </pre>
  );
};

const ExplainabilityPanel = ({ explain, title = 'Why this answer?', defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  if (!explain) return null;

  const {
    confidence = 0,
    confidence_label = 'low',
    rationale,
    sources = [],
    method,
  } = explain;

  const color = LABEL_COLOR[confidence_label] || '#8896A8';
  const pct = Math.round(Math.max(0, Math.min(1, confidence)) * 100);

  return (
    <div className="mt-4 border border-[#263244] rounded-xl overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        className="w-full px-4 py-3 bg-[#0E141E] flex items-center justify-between gap-3 text-sm font-medium text-[#9AA9BD] hover:bg-[#182233] transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFB020]"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
          {title}
        </span>
        <span className="flex items-center gap-2">
          <span
            className="mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider"
            style={{ background: `${color}1f`, color }}
          >
            {confidence_label} · {pct}%
          </span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {open && (
        <div className="p-4 bg-[#131A26] border-t border-[#263244] space-y-4">
          {/* Rationale */}
          {rationale && (
            <p className="text-sm text-[#38BDF8] leading-relaxed">{rationale}</p>
          )}

          {/* Confidence / relevance */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#8896A8]" />
              <span className="eyebrow">Confidence / relevance</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#0E141E] overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>

          {/* Sources used */}
          {sources && sources.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-3.5 h-3.5 text-[#8896A8]" />
                <span className="eyebrow">Sources used ({sources.length})</span>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                {sources.map((s, i) => (
                  <SourceRow key={i} source={s} />
                ))}
              </div>
            </div>
          )}

          {method && (
            <p className="mono text-[11px] text-[#64748B]">Method: {method}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplainabilityPanel;
