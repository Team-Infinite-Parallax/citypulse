import React from 'react';
import { BarChart3, ExternalLink } from 'lucide-react';

const LookerEmbed = () => {
  // In production, this would be the actual Looker Studio embed URL
  // For demo, we show a representative preview
  const LOOKER_EMBED_URL = 'https://lookerstudio.google.com/embed/reporting/placeholder';

  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-[#8B5CF6]" />
        <span className="eyebrow">Looker Studio · City Official Dashboard</span>
        <a
          href={LOOKER_EMBED_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-xs text-[#38BDF8] hover:underline"
        >
          <ExternalLink className="w-3 h-3" /> Open in Looker
        </a>
      </div>

      <div className="bg-[#0E141E] rounded-xl border border-[#263244] p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-[#8B5CF6]" />
        </div>
        <h3 className="text-lg font-semibold text-[#38BDF8] mb-2">Looker Studio Integration</h3>
        <p className="text-sm text-[#64748B] max-w-xl mx-auto leading-relaxed mb-4">
          Connect your BigQuery tables to Looker Studio for a comprehensive city-official dashboard
          with drill-down ward analysis, trend comparisons, and exportable reports.
        </p>
        <div className="inline-flex items-center gap-2 bg-[#1B2534] rounded-lg px-4 py-2 text-xs text-[#64748B]">
          <span className="text-[#10B981]">●</span> BigQuery tables: traffic_summary, incidents, environment, energy, tourism_poi
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          {[
            { label: 'Traffic Trends', desc: 'Hourly congestion by corridor' },
            { label: 'Incident Heatmap', desc: 'Safety incidents by ward' },
            { label: 'Livability Scorecard', desc: 'Cross-domain ward ranking' },
            { label: 'Energy Efficiency', desc: 'Solar & water metrics' },
          ].map(item => (
            <div key={item.label} className="bg-[#131A26] rounded-lg p-3 border border-[#263244]">
              <span className="text-sm font-semibold text-[#38BDF8] block">{item.label}</span>
              <span className="text-xs text-[#64748B]">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LookerEmbed;