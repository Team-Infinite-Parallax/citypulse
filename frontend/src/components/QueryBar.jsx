import React, { useState } from 'react';
import { Send, Bot, Loader2, ChevronDown, ChevronUp, AlertCircle, BarChart2, Sparkles } from 'lucide-react';
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
      const API = import.meta.env.PUBLIC_API_URL || '';
      const res = await fetch(`${API}/api/query`, {
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
    <div className="panel p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
        <span className="eyebrow">Ask the city</span>
      </div>
      <form onSubmit={handleSubmit} className="relative">
<<<<<<< HEAD
        <div className="flex items-center query-bar">
=======
        <label htmlFor="query-input" className="flex items-center bg-[#0E141E] border border-[#263244] rounded-xl overflow-hidden focus-within:border-[#FFB020] transition-colors">
>>>>>>> 1b697b62e5a1ae4f6fe550444f2e18c2df5c5c2a
          <div className="pl-4 text-[#64748B]">
            <Bot className="w-6 h-6" />
          </div>
          <input
            id="query-input"
            name="query"
            type="text"
            autoComplete="off"
            aria-label="Ask the city"
            className="flex-1 bg-transparent border-none py-4 px-4 text-[#E6EDF3] placeholder-[#64748B] focus:outline-none"
            placeholder="e.g. Which corridor has the worst congestion right now?…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="btn-signal px-6 py-4 flex items-center gap-2 active:scale-95 transition-transform"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Ask</>}
          </button>
        </label>
      </form>

      {error && (
        <div className="mt-4 bg-[#FF5A5F]/10 text-[#FF9497] p-4 rounded-xl border border-[#FF5A5F]/30 flex items-start" aria-live="assertive">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-6 border-t border-[var(--glass-border)] pt-6" aria-live="polite">
          <div className="flex items-start mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#31D0AA]/12 flex items-center justify-center text-[#31D0AA] mr-4 flex-shrink-0 border border-[#31D0AA]/25">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="eyebrow mb-1.5">CityPulse AI</h4>
              <p className="text-[#E6EDF3] text-lg leading-relaxed">{response.answer}</p>
            </div>
          </div>

          {response.chart_data && response.chart_data.length > 0 && (
            <div className="mt-6 mb-6 bg-[#0E141E] p-4 rounded-xl border border-[#1B2534] h-80 flex flex-col">
              <h5 className="eyebrow mb-4 flex items-center flex-shrink-0">
                <BarChart2 className="w-3.5 h-3.5 mr-2" /> Data Visualization
              </h5>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={response.chart_data}>
                    <XAxis dataKey="label" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={{ background: '#131A26', border: '1px solid #263244', borderRadius: '10px', color: '#E6EDF3' }} />
                    <Bar dataKey="value" fill="#FFB020" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {response.cited_points && response.cited_points.length > 0 && (
            <div className="mt-4 border border-[#263244] rounded-xl overflow-hidden">
              <button
                type="button"
                aria-expanded={showExplanation}
                className="w-full px-4 py-3 bg-[#0E141E] flex items-center justify-between text-sm font-medium text-[#9AA9BD] hover:bg-[#182233] transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFB020]"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                <span className="mono text-xs">grounded on {response.cited_points.length} data point(s)</span>
                {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showExplanation && (
                <div className="p-4 bg-[#131A26] border-t border-[#263244] max-h-60 overflow-y-auto custom-scrollbar">
                  <div className="space-y-3">
                    {response.cited_points.map((point, idx) => (
                      <div key={idx} className="text-xs font-mono bg-[#0E141E] p-3 rounded-lg overflow-x-auto text-[#9AA9BD] border border-[#1B2534]">
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
