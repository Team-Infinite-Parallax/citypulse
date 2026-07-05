import React, { useState } from 'react';
import { Send, Bot, Loader2, ChevronDown, ChevronUp, AlertCircle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import useCityStore from '../store/useCityStore';

const QueryBar = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const addQueryToHistory = useCityStore((state) => state.addQuery);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);
    setShowExplanation(false);

    try {
      const res = await fetch('http://localhost:3001/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      });

      if (!res.ok) throw new Error('Failed to fetch AI response');
      
      const data = await res.json();
      setResponse(data);
      addQueryToHistory({ question: query, ...data });
    } catch (err) {
      console.error(err);
      setError("Sorry, we couldn't connect to the AI service. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <div className="pl-4 text-slate-400">
            <Bot className="w-6 h-6" />
          </div>
          <input
            type="text"
            className="flex-1 bg-transparent border-none py-4 px-4 text-slate-700 placeholder-slate-400 focus:outline-none"
            placeholder="Ask CityPulse (e.g., 'Which route has the worst congestion?')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="px-6 py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-6 border-t border-slate-100 pt-6">
          <div className="flex items-start mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-500 mb-1">AI Assistant</h4>
              <p className="text-slate-800 text-lg leading-relaxed">{response.answer}</p>
            </div>
          </div>

          {response.chart_data && response.chart_data.length > 0 && (
            <div className="mt-6 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 h-64">
              <h5 className="text-sm font-medium text-slate-500 mb-4 flex items-center">
                <BarChart2 className="w-4 h-4 mr-2" /> Data Visualization
              </h5>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={response.chart_data}>
                  <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {response.cited_points && response.cited_points.length > 0 && (
            <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                <span>Why this answer? (Grounded Data)</span>
                {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showExplanation && (
                <div className="p-4 bg-white border-t border-slate-200 max-h-60 overflow-y-auto">
                  <p className="text-xs text-slate-500 mb-3">
                    The AI generated its answer based solely on the following {response.cited_points.length} data point(s):
                  </p>
                  <div className="space-y-3">
                    {response.cited_points.map((point, idx) => (
                      <div key={idx} className="text-xs font-mono bg-slate-100 p-3 rounded-lg overflow-x-auto text-slate-700">
                        {JSON.stringify(point, null, 2)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QueryBar;
