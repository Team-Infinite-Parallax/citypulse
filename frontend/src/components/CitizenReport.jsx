import React, { useState } from 'react';
import { Camera, Send, Loader2, CheckCircle } from 'lucide-react';

const CitizenReport = () => {
  const [text, setText] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // Get base64 string, remove data url prefix
      const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
      setPhotoBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !photoBase64) return;

    setLoading(true);
    setError(null);

    try {
      const API = import.meta.env.PUBLIC_API_URL || '';
      const res = await fetch(`${API}/api/citizen/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          photoBase64, 
          ward: 'Gomti Nagar', // Default mock ward
          lat: 12.9750, 
          lng: 77.6100 
        })
      });
      
      if (!res.ok) throw new Error('Failed to submit report');
      setSuccess(true);
      setText('');
      setPhotoBase64('');
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel p-5">
      <h3 className="text-lg font-bold text-[#38BDF8] mb-4 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-[#3b82f6]"></span>
        Citizen Report
      </h3>
      
      {success ? (
        <div className="bg-[#10b981]/10 text-[#10b981] p-4 rounded-lg flex items-center gap-3 border border-[#10b981]/20">
          <CheckCircle className="w-5 h-5" />
          <p className="font-semibold text-sm">Report submitted successfully!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              className="w-full bg-[#0E141E] border border-[#263244] rounded-lg p-3 text-sm text-[#38BDF8] placeholder-[#64748B] focus:border-[#3b82f6] focus:outline-none transition-colors min-h-[100px] resize-none"
              placeholder="Describe the issue (e.g., severe pothole on Main St, uncollected garbage...)"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          {error && <p className="text-[#FF9497] text-xs">{error}</p>}
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#8896A8] hover:text-[#38BDF8] transition-colors">
                <Camera className="w-4 h-4" />
                <span>{photoBase64 ? 'Photo Attached' : 'Attach Photo'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoUpload} 
                />
              </label>
              <span className="text-[10px] text-[#FFB020] font-semibold tracking-wide">✨ Gemini Multimodal Vision API</span>
            </div>
            
            <button
              type="submit"
              disabled={loading || (!text && !photoBase64)}
              className="btn-signal bg-[#3b82f6]/20 text-[#3b82f6] hover:bg-[#3b82f6]/30 px-4 py-2 flex items-center gap-2 border border-[#3b82f6]/30 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Submit</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CitizenReport;
