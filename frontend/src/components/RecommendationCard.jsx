import React, { useEffect, useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';

const RecommendationCard = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const API = import.meta.env.PUBLIC_API_URL || '';
        const res = await fetch(`${API}/api/recommendations`);
        if (!res.ok) throw new Error('Failed to fetch recommendations');
        const data = await res.json();
        setRecommendations(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load AI recommendations.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="panel h-64 flex flex-col justify-center items-center" aria-live="polite">
        <div className="w-8 h-8 border-4 border-[#31D0AA] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm font-medium text-[#9AA9BD]">Generating AI Recommendations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel p-5 flex items-center text-[#FF9497] border border-[#FF5A5F]/30" aria-live="assertive">
        <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
        <p className="font-semibold text-sm">{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="panel h-64 flex flex-col justify-center items-center">
        <div className="w-12 h-12 bg-[#31D0AA]/10 text-[#31D0AA] border border-[#31D0AA]/20 rounded-full flex items-center justify-center mb-3 shadow-[0_0_12px_rgba(49,208,170,0.15)]">
          <Lightbulb className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-[#E6EDF3]">No Action Needed</h3>
        <p className="text-sm text-[#9AA9BD] mt-1">Traffic patterns are within normal parameters.</p>
      </div>
    );
  }

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-head">
        <h3 className="text-base font-bold text-[#E6EDF3] flex items-center">
          <Sparkles className="w-4 h-4 text-[#FFB020] mr-2" />
          AI Recommendations ({recommendations.length})
        </h3>
      </div>
      
      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar flex-grow">
        {recommendations.map(rec => (
          <div key={rec.id} className="border border-[#1B2534] rounded-xl overflow-hidden bg-[#0E141E] hover:border-[#FFB020]/50 transition-all hover:-translate-y-0.5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="mono text-[10px] font-bold px-2 py-1 rounded tracking-wider bg-[#31D0AA]/10 text-[#31D0AA] border border-[#31D0AA]/20 uppercase">
                  {rec.route_name}
                </span>
                <span className="text-xs font-medium text-[#9AA9BD] px-2 py-1 bg-[#131A26] border border-[#263244] rounded">
                  {rec.issue}
                </span>
              </div>
              
              <div className="mt-3 flex items-start">
                <Lightbulb className="w-4 h-4 text-[#FFB020] mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-[#E6EDF3] text-sm font-medium leading-relaxed">
                  {rec.suggestion}
                </p>
              </div>
            </div>

            <div className="border-t border-[#1B2534]">
              <button
                type="button"
                aria-expanded={expandedId === rec.id}
                className="w-full px-4 py-3 bg-[#131A26] flex items-center justify-between text-xs font-medium text-[#9AA9BD] hover:bg-[#182233] transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFB020]"
                onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
              >
                <span>Why this recommendation? (Supporting Data)</span>
                {expandedId === rec.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedId === rec.id && (
                <div className="p-4 bg-[#0B0E14] border-t border-[#1B2534]">
                  <p className="text-xs text-[#9AA9BD] mb-2">
                    Triggered by sustained high congestion during peak hours:
                  </p>
                  <div className="space-y-2">
                    {rec.supporting_data.map((point, idx) => (
                      <div key={idx} className="text-xs font-mono bg-[#131A26] p-2 rounded text-[#9AA9BD] border border-[#1B2534] flex justify-between">
                        <span>{new Date(point.timestamp).toLocaleString()}</span>
                        <span className="font-semibold text-[#FF5A5F]">Score: {point.congestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCard;
