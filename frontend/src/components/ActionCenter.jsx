import React, { useEffect, useState } from 'react';
import { ClipboardList, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const ActionCenter = () => {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMemos();
  }, []);

  const fetchMemos = async () => {
    try {
      setLoading(true);
      const API = import.meta.env.PUBLIC_API_URL || '';
      const res = await fetch(`${API}/api/actions/memos`);
      if (!res.ok) throw new Error('Failed to fetch action memos');
      const data = await res.json();
      setMemos(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load action center memos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async (id) => {
    try {
      const API = import.meta.env.PUBLIC_API_URL || '';
      const res = await fetch(`${API}/api/actions/dispatch/${id}`, { method: 'POST' });
      if (res.ok) {
        fetchMemos();
      }
    } catch (err) {
      console.error('Failed to dispatch memo:', err);
    }
  };

  const handleTestDraft = async () => {
    try {
      const API = import.meta.env.PUBLIC_API_URL || '';
      const res = await fetch(`${API}/api/actions/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'TEST_ANOMALY', details: 'High congestion on Main St.' })
      });
      if (res.ok) {
        fetchMemos();
      }
    } catch (err) {
      console.error('Failed to draft memo:', err);
    }
  };

  if (loading && memos.length === 0) {
    return (
      <div className="panel p-6 flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-[#31D0AA] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#E6EDF3] flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#FFB020]" /> Action Center
        </h3>
        <button 
          onClick={handleTestDraft}
          className="text-xs px-3 py-1.5 rounded bg-[#1B2534] border border-[#263244] text-[#E6EDF3] hover:bg-[#263244] transition-colors"
        >
          + Draft Test Memo
        </button>
      </div>

      {error && <p className="text-[#FF9497] text-sm">{error}</p>}
      
      {memos.length === 0 ? (
        <p className="text-sm text-[#8896A8] italic">No action memos generated yet.</p>
      ) : (
        memos.map(memo => (
          <div key={memo.id} className="panel p-5 border border-[#263244] hover:border-[#31D0AA]/30 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-[#E6EDF3]">{memo.title}</h4>
                <p className="text-xs text-[#8896A8] mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Dept: {memo.department}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded font-bold ${memo.status === 'DISPATCHED' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#f97316]/20 text-[#f97316]'}`}>
                {memo.status}
              </span>
            </div>
            
            <p className="text-sm text-[#E6EDF3] mb-3">{memo.justification}</p>
            
            <div className="bg-[#0B0E14] p-3 rounded text-sm mb-4">
              <span className="eyebrow block mb-2 text-[#8896A8]">Action Items:</span>
              <ul className="list-disc pl-4 text-[#E6EDF3] space-y-1">
                {memo.action_items?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#263244]">
              <span className="text-xs text-[#64748B] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 
                {new Date(memo.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
              
              {memo.status === 'DRAFT' && (
                <button 
                  onClick={() => handleDispatch(memo.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-[#31D0AA] text-[#0B0E14] rounded hover:bg-[#31D0AA]/90 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Approve & Dispatch
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActionCenter;
