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
