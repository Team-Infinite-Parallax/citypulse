import React, { useEffect, useState } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import useCityStore from '../store/useCityStore';
import routesGeoJson from '../data/routes.json'; // In Vite/Astro this might need special handling, let's fetch or import it properly. Wait, it's better to fetch it if it's in public, or just import as JSON.

// Actually, in Vite we can import JSON directly.
// But Astro handles JSON imports out of the box.

const MapView = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [incidentsData, setIncidentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const setSelectedRoute = useCityStore((state) => state.setSelectedRoute);
  const selectedRoute = useCityStore((state) => state.selectedRoute);
  const showIncidents = useCityStore((state) => state.showIncidents);
  const setShowIncidents = useCityStore((state) => state.setShowIncidents);
  const liteMode = useCityStore((state) => state.liteMode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API = import.meta.env.PUBLIC_API_URL || '';
        const [trafficRes, incidentsRes] = await Promise.all([
          fetch(`${API}/api/traffic/summary`),
          fetch(`${API}/api/public-safety/incidents`)
        ]);
        if (!trafficRes.ok) throw new Error('Failed to fetch traffic summary');
        
        setSummaryData(await trafficRes.json());
        if (incidentsRes.ok) {
          setIncidentsData(await incidentsRes.json());
        }
        
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load map data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Merge summary data (average congestion) into GeoJSON properties to drive color
  const enrichedGeoJson = {
    ...routesGeoJson,
    features: routesGeoJson.features.map(feature => {
      const routeStats = summaryData.find(s => s.route_name === feature.properties.name);
      return {
        ...feature,
        properties: {
          ...feature.properties,
          congestion: routeStats ? routeStats.avg_congestion : 0,
          isSelected: feature.properties.name === selectedRoute
        }
      };
    })
  };

  const incidentsGeoJson = {
    type: 'FeatureCollection',
    features: incidentsData.map(inc => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [inc.lng, inc.lat]
      },
      properties: {
        id: inc.incident_id,
        type: inc.type,
        ward: inc.ward,
        severity: inc.severity,
        notes: inc.notes
      }
    }))
  };

  const getLineColor = () => [
    'case',
    ['==', ['get', 'isSelected'], true],
    '#3b82f6', // highlight selected route in blue
    [
      'interpolate',
      ['linear'],
      ['get', 'congestion'],
      0, '#10b981',   // Green
      50, '#F97316',  // Orange
      100, '#ef4444'  // Red
    ]
  ];

  const getLineWidth = () => [
    'case',
    ['==', ['get', 'isSelected'], true],
    8,
    5
  ];

  const onClick = (e) => {
    if (e.features && e.features.length > 0) {
      const clickedRoute = e.features[0].properties.name;
      // Toggle selection
      setSelectedRoute(selectedRoute === clickedRoute ? '' : clickedRoute);
    } else {
      setSelectedRoute('');
    }
  };

  if (liteMode) {
    return (
      <div className="panel p-5 space-y-5 bg-[#0B0E14] border border-[#263244] rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#F97316] animate-pulse"></span>
            <h3 className="text-sm font-semibold text-[#8896A8] uppercase tracking-wider">Network Summary (Lite Mode)</h3>
          </div>
          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`px-3 py-1 rounded text-xs font-semibold border transition-all ${
              showIncidents 
                ? 'bg-[#10b981]/25 text-[#10b981] border-[#10b981]/40' 
                : 'bg-[#0E141E] text-[#8896A8] border-[#263244]'
            }`}
          >
            {showIncidents ? 'Hide Incidents' : 'Show Incidents'}
          </button>
        </div>

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#31D0AA] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-sm text-[#FF9497] text-center py-6">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Corridors List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Corridors</h4>
              {summaryData.map(route => {
                const isSelected = route.route_name === selectedRoute;
                const statusColor = route.avg_congestion >= 70 ? 'text-[#FF5A5F]' : route.avg_congestion >= 40 ? 'text-[#F97316]' : 'text-[#31D0AA]';
                const statusBg = route.avg_congestion >= 70 ? 'bg-[#FF5A5F]/10 border-[#FF5A5F]/35' : route.avg_congestion >= 40 ? 'bg-[#F97316]/10 border-[#F97316]/35' : 'bg-[#31D0AA]/10 border-[#31D0AA]/35';

                return (
                  <div
                    key={route.route_name}
                    onClick={() => setSelectedRoute(isSelected ? '' : route.route_name)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all select-none ${
                      isSelected 
                        ? 'border-[#3b82f6] bg-[#3b82f6]/10 shadow-[0_0_12px_rgba(59,130,246,0.15)]' 
                        : 'border-[#1B2534] bg-[#0E141E] hover:border-[#31D0AA]/40'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm text-[#31D0AA]">{route.route_name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border mono font-bold ${statusColor} ${statusBg}`}>
                        {route.avg_congestion}% Congestion
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#8896A8]">
                      <span>Avg Delay: <span className="font-medium text-white">{route.avg_delay_minutes} mins</span></span>
                      <span>Peak: <span className="font-medium text-white">{route.peak_hour}</span></span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-[#131A26] rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-full rounded-full ${route.avg_congestion >= 70 ? 'bg-[#ef4444]' : route.avg_congestion >= 40 ? 'bg-[#F97316]' : 'bg-[#10b981]'}`}
                        style={{ width: `${route.avg_congestion}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Incidents List (if toggled) */}
            <div className="space-y-3 border-t md:border-t-0 md:border-l border-[#263244] pt-4 md:pt-0 md:pl-4 max-h-[340px] overflow-y-auto custom-scrollbar">
              <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Active Incidents</h4>
              {!showIncidents ? (
                <p className="text-xs text-[#8896A8] italic">Click "Show Incidents" to list active hazard alerts.</p>
              ) : incidentsData.length === 0 ? (
                <p className="text-xs text-[#8896A8] italic">No active safety alerts logged.</p>
              ) : (
                incidentsData.map(inc => {
                  const sevColor = inc.severity === 'CRITICAL' ? 'text-[#ef4444]' : inc.severity === 'HIGH' ? 'text-[#f97316]' : 'text-[#eab308]';
                  return (
                    <div key={inc.incident_id} className="p-3 bg-[#0E141E] border border-[#1B2534] rounded-lg space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-[#31D0AA]">{inc.ward} ({inc.type})</span>
                        <span className={`text-[10px] font-bold uppercase ${sevColor}`}>{inc.severity}</span>
                      </div>
                      <p className="text-xs text-[#8896A8] leading-normal">{inc.notes || 'No description logged.'}</p>
                      <div className="text-[10px] text-[#64748B] mono">
                        {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[50vh] min-h-[300px] lg:h-[560px] panel overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0B0E14]/60 backdrop-blur-md" aria-live="polite">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-[#31D0AA] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-sm font-medium text-[#9AA9BD]">Loading map data…</p>
          </div>
        </div>
      )}
      
      {error && !loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0B0E14]/60 backdrop-blur-md" aria-live="assertive">
          <div className="bg-[#0E141E] text-[#FF9497] px-4 py-3 rounded-lg border border-[#FF5A5F]/30 shadow-lg flex items-center">
            <p className="font-semibold text-sm">{error}</p>
          </div>
        </div>
      )}

      <Map
        initialViewState={{
          longitude: 77.6200,
          latitude: 12.9800,
          zoom: 11
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        interactive={true}
        onClick={onClick}
        interactiveLayerIds={summaryData.length > 0 ? ['route-lines'] : []}
        cursor="pointer"
      >
        <NavigationControl position="top-right" />
        
        {summaryData.length > 0 && (
          <Source id="routes" type="geojson" data={enrichedGeoJson}>
            <Layer
              id="route-lines"
              type="line"
              source="routes"
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
              paint={{
                'line-color': getLineColor(),
                'line-width': getLineWidth(),
                'line-opacity': 0.8
              }}
            />
          </Source>
        )}

        {showIncidents && incidentsData.length > 0 && (
          <Source id="incidents" type="geojson" data={incidentsGeoJson}>
            <Layer
              id="incident-points"
              type="circle"
              source="incidents"
              paint={{
                'circle-radius': [
                  'case',
                  ['==', ['get', 'severity'], 'CRITICAL'], 8,
                  ['==', ['get', 'severity'], 'HIGH'], 6,
                  ['==', ['get', 'severity'], 'WARNING'], 5,
                  4
                ],
                'circle-color': [
                  'case',
                  ['==', ['get', 'severity'], 'CRITICAL'], '#ef4444',
                  ['==', ['get', 'severity'], 'HIGH'], '#f97316',
                  ['==', ['get', 'severity'], 'WARNING'], '#eab308',
                  '#3b82f6'
                ],
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
              }}
            />
          </Source>
        )}
      </Map>

      {/* Control Panel overlays */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors border ${
            showIncidents 
              ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/50' 
              : 'bg-[#0E141E] text-[#8896A8] border-[#263244] hover:text-[#31D0AA]'
          }`}
        >
            {showIncidents ? 'Hide Incidents' : 'Show Incidents'}
        </button>
      </div>
    </div>
  );
};

export default MapView;
