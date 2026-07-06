import React, { useEffect, useState } from 'react';
import useCityStore from '../store/useCityStore';
import MapView from './MapView.jsx';
import Dashboard from './Dashboard.jsx';
import QueryBar from './QueryBar.jsx';
import AlertsPanel from './AlertsPanel.jsx';
import RecommendationCard from './RecommendationCard.jsx';
import HealthAdvisory from './HealthAdvisory.jsx';
import WardDetailPanel from './WardDetailPanel.jsx';
import ActionCenter from './ActionCenter.jsx';
import CitizenReport from './CitizenReport.jsx';
import { AlertTriangle, Zap } from 'lucide-react';

const AppBody = () => {
  const { viewMode, liteMode, setLiteMode } = useCityStore();
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (navigator.connection) {
      const conn = navigator.connection;
      const checkSpeed = () => {
        const type = conn.effectiveType;
        setIsSlow(type === '2g' || type === '3g');
      };
      checkSpeed();
      conn.addEventListener('change', checkSpeed);
      return () => conn.removeEventListener('change', checkSpeed);
    }
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8 lg:space-y-10">
        
        {/* Slow connection fallback banner */}
        {isSlow && !liteMode && (
          <div className="bg-[#F97316]/10 text-[#FF9F1C] border border-[#F97316]/30 px-4 py-3 rounded-xl flex items-center justify-between gap-3 shadow-lg" role="alert">
            <span className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#F97316] animate-pulse" />
              Slow network connection detected. Switch to Lite Mode for faster performance?
            </span>
            <button
              onClick={() => setLiteMode(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F97316] text-[#0B0E14] text-xs font-bold rounded-lg hover:bg-[#F97316]/90 transition-all select-none"
            >
              <Zap className="w-3.5 h-3.5" /> Enable Lite Mode
            </button>
          </div>
        )}

        {viewMode === 'citizen' ? (
          /* CITIZEN VIEW: Simplified layout */
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Ask the City */}
            <section aria-label="Ask the City">
              <QueryBar />
            </section>

            {/* Map View / Simplified telemetry */}
            <section aria-label="City Map">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                <h2 className="text-lg font-bold text-white">Live City Map</h2>
                <span className="eyebrow ml-auto">Bengaluru Network Status</span>
              </div>
              <MapView />
            </section>

            {/* Citizen Report Intake */}
            <section aria-label="Submit Report">
              <CitizenReport />
            </section>
          </div>
        ) : (
          /* PLANNER VIEW: Full analytics layout */
          <>
            {/* Ask the City */}
            <QueryBar />

            {/* Map View */}
            <section aria-label="Traffic Map">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 rounded-full bg-[#31D0AA] shadow-[0_0_8px_rgba(49,208,170,0.6)]"></span>
                <h2 class="text-lg font-bold" style={{ color: 'var(--amber)' }}>Traffic Map</h2>
                <span className="eyebrow ml-auto hidden sm:block">Bengaluru · Live Network</span>
              </div>
              <MapView />
            </section>

            {/* Environmental wellness */}
            <section aria-label="Health & Air-Quality Advisories">
              <HealthAdvisory />
            </section>

            {/* Live Telemetry */}
            <section aria-label="Live Telemetry">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 rounded-full bg-[#31D0AA] shadow-[0_0_8px_rgba(49,208,170,0.6)]"></span>
                <h2 class="text-lg font-bold" style={{ color: 'var(--amber)' }}>Live Telemetry</h2>
              </div>
              <Dashboard />
            </section>

            {/* Alerts + Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <AlertsPanel />
              <RecommendationCard />
            </div>

            {/* Ward Livability */}
            <section aria-label="Ward Livability">
              <h2 className="text-lg font-bold text-[#31D0AA] mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#10b981]"></span>
                Ward Livability Score
              </h2>
              <WardDetailPanel />
            </section>

            {/* Action Center & Citizen Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActionCenter />
              <CitizenReport />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppBody;
