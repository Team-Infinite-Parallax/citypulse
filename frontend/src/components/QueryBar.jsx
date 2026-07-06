import React, { useState, useCallback, useRef } from 'react';
import { Send, Bot, Loader2, AlertCircle, BarChart2, Sparkles, Mic, MicOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import useCityStore from '../store/useCityStore';
import ExplainabilityPanel from './ExplainabilityPanel';

const VOICE_SUPPORTED = typeof window !== 'undefined' &&
  ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

const CANNED_EXAMPLES = [
  "Which ward has the most incidents and worst AQI?",
  "Is there a correlation between traffic congestion and air quality today?",
  "Plan my ideal commute: lowest AQI and least congestion",
  "Simulate AQI impact if waste collection improves by 20% across all wards",
  "Which areas need priority disaster preparedness resources?",
  "Rank wards by tourism potential and safety",
];

const QueryBar = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const addQueryToHistory = useCityStore((state) => state.addQuery);
  const viewMode = useCityStore((state) => state.viewMode);

  const startListening = useCallback(() => {
    if (!VOICE_SUPPORTED) return;
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

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
        <span className="eyebrow">
          {viewMode === 'citizen' ? 'Ask your city anything' : 'Ask the city'}
        </span>
        {VOICE_SUPPORTED && (
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            className={`ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              listening
                ? 'bg-[#FF5A5F]/20 text-[#FF5A5F] border-[#FF5A5F]/50 animate-pulse'
                : 'bg-[#1B2534] text-[#8896A8] border-[#263244] hover:text-[#38BDF8]'
            }`}
            aria-label={listening ? 'Stop listening' : 'Voice input'}
          >
            {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            {listening ? 'Listening...' : 'Voice (Multimodal)'}
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-[#E8F9EE] border border-[#6EE3A0] rounded-xl overflow-hidden focus-within:border-[#6EE3A0] transition-colors">
          <div className="pl-4 text-[#4EBF79]">
            <Bot className="w-6 h-6" />
          </div>
          <input
            id="query-input"
            name="query"
            type="text"
            autoComplete="off"
            aria-label="Ask the city"
            className="flex-1 bg-transparent border-none py-4 px-4 text-[#11502B] placeholder-[#6A8B6F] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            placeholder={viewMode === 'citizen' ? "e.g. Is it safe to travel on MG Road?…" : "e.g. Which corridor has the worst congestion right now?…"}
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
        </div>
      </form>

      {viewMode === 'planner' && (
        <div className="mt-3 flex flex-wrap gap-2">
          {CANNED_EXAMPLES.map((example) => (
            <button
              key={example}
              onClick={() => setQuery(example)}
              className="text-xs px-3 py-1.5 rounded-full bg-[#1B2534] text-[#8896A8] hover:bg-[#263244] hover:text-[#38BDF8] transition-colors border border-[#263244]"
            >
              {example}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 bg-[#FF5A5F]/10 text-[#FF9497] p-4 rounded-xl border border-[#FF5A5F]/30 flex items-start" aria-live="assertive">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-6 border-t border-[var(--glass-border)] pt-6" aria-live="polite">
          <div className="flex items-start mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/12 flex items-center justify-center text-[#38BDF8] mr-4 flex-shrink-0 border border-[#38BDF8]/25">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="eyebrow mb-1.5">CityPulse AI</h4>
              <p className="text-[#38BDF8] text-lg leading-relaxed">{response.answer}</p>
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
                    <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={{ background: '#131A26', border: '1px solid #263244', borderRadius: '10px', color: '#38BDF8' }} />
                    <Bar dataKey="value" fill="#FFB020" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {response.explain && (
            <ExplainabilityPanel explain={response.explain} title="Why this answer?" />
          )}
        </div>
      )}
    </div>
  );
};

export default QueryBar;
