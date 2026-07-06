import React, { useEffect } from 'react';
import useCityStore from '../store/useCityStore';
import { User, Shield, Zap, ZapOff } from 'lucide-react';

const HeaderActions = () => {
  const { viewMode, setViewMode, liteMode, setLiteMode } = useCityStore();

  useEffect(() => {
    // Network Information API check for slow connection on mount
    if (navigator.connection) {
      const conn = navigator.connection;
      const checkSpeed = () => {
        const type = conn.effectiveType;
        if (type === '2g' || type === '3g') {
          console.warn(`[Network] Slow connection detected (${type}). Enabling Lite Mode.`);
          setLiteMode(true);
        }
      };
      
      checkSpeed();
      conn.addEventListener('change', checkSpeed);
      return () => conn.removeEventListener('change', checkSpeed);
    }
  }, [setLiteMode]);

  return (
    <div className="flex items-center gap-3 sm:gap-4 ml-auto shrink-0 select-none">
      {/* View Mode Toggle */}
      <div className="flex items-center bg-[#0E141E] p-1 rounded-lg border border-[#263244] shadow-inner">
        <button
          onClick={() => setViewMode('planner')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
            viewMode === 'planner'
              ? 'bg-[#31D0AA] text-[#0B0E14] shadow-md'
              : 'text-[#8896A8] hover:text-[#31D0AA]'
          }`}
          title="Planner view (full analytics)"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Planner</span>
        </button>
        <button
          onClick={() => setViewMode('citizen')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
            viewMode === 'citizen'
              ? 'bg-[#3b82f6] text-white shadow-md'
              : 'text-[#8896A8] hover:text-[#3b82f6]'
          }`}
          title="Citizen view (simplified)"
        >
          <User className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Citizen</span>
        </button>
      </div>

      {/* Lite Mode Toggle */}
      <button
        onClick={() => setLiteMode(!liteMode)}
        className={`flex items-center justify-center p-2 rounded-lg border transition-all ${
          liteMode
            ? 'bg-[#F97316]/20 border-[#F97316]/50 text-[#F97316] hover:bg-[#F97316]/30 shadow-lg shadow-[#F97316]/10'
            : 'bg-[#0E141E] border-[#263244] text-[#8896A8] hover:text-[#31D0AA]'
        }`}
        title={liteMode ? 'Disable Lite Mode (Load maps/charts)' : 'Enable Lite Mode (Low bandwidth)'}
      >
        {liteMode ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default HeaderActions;
