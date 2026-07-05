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
        const res = await fetch('http://localhost:3001/api/recommendations');
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
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 h-64 flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm font-medium text-slate-600">Generating AI Recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-5 rounded-2xl border border-red-100 flex items-center">
        <AlertCircle className="w-5 h-5 mr-3" />
        <p className="font-semibold text-sm">{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 h-64 flex flex-col justify-center items-center">
        <div className="w-12 h-12 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mb-3">
          <Lightbulb className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-slate-800">No Action Needed</h3>
        <p className="text-sm text-slate-500 mt-1">Traffic patterns are within normal parameters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
        <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
        AI Recommendations ({recommendations.length})
      </h3>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {recommendations.map(rec => (
          <div key={rec.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:border-blue-300 transition-colors">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold px-2 py-1 rounded tracking-wider bg-blue-100 text-blue-700">
                  {rec.route_name}
                </span>
                <span className="text-xs font-medium text-slate-500 px-2 py-1 bg-white border border-slate-200 rounded">
                  {rec.issue}
                </span>
              </div>
              
              <div className="mt-3 flex items-start">
                <Lightbulb className="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-slate-800 font-medium leading-relaxed">
                  {rec.suggestion}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200">
              <button
                type="button"
                className="w-full px-4 py-2 bg-white flex items-center justify-between text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
              >
                <span>Why this recommendation? (Supporting Data)</span>
                {expandedId === rec.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedId === rec.id && (
                <div className="p-4 bg-white border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">
                    Triggered by sustained high congestion during peak hours:
                  </p>
                  <div className="space-y-2">
                    {rec.supporting_data.map((point, idx) => (
                      <div key={idx} className="text-xs font-mono bg-slate-100 p-2 rounded text-slate-700 flex justify-between">
                        <span>{new Date(point.timestamp).toLocaleString()}</span>
                        <span className="font-semibold text-red-600">Score: {point.congestion}</span>
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
