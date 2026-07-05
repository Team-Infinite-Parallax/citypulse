import React, { useEffect, useState } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import routesGeoJson from '../data/routes.geojson'; // In Vite/Astro this might need special handling, let's fetch or import it properly. Wait, it's better to fetch it if it's in public, or just import as JSON.

// Actually, in Vite we can import JSON directly.
// But Astro handles JSON imports out of the box.

const MapView = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3001/api/traffic/summary');
        if (!res.ok) throw new Error('Failed to fetch traffic summary');
        const data = await res.json();
        setSummaryData(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load traffic data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
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
          congestion: routeStats ? routeStats.avg_congestion : 0
        }
      };
    })
  };

  const getLineColor = () => [
    'interpolate',
    ['linear'],
    ['get', 'congestion'],
    0, '#10b981',   // Green
    50, '#f59e0b',  // Orange
    100, '#ef4444'  // Red
  ];

  return (
    <div className="relative w-full h-[600px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm font-medium text-slate-700">Loading map data...</p>
          </div>
        </div>
      )}
      
      {error && !loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-100 shadow-sm">
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
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactive={true}
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
                'line-width': 6,
                'line-opacity': 0.8
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default MapView;
