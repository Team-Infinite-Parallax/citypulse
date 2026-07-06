import React, { useEffect, useState } from 'react';
import { MapPin, Star, Users, Calendar, TrendingUp } from 'lucide-react';

const CATEGORY_ICONS = { shopping: '🛍️', dining: '🍽️', park: '🌳', wellness: '🧘', culture: '🎭', business: '💼', food: '🍴' };

const TourismPanel = () => {
  const [pois, setPois] = useState([]);
  const [events, setEvents] = useState([]);
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API = import.meta.env.PUBLIC_API_URL || '';
        const [poiRes, eventRes, impactRes] = await Promise.all([
          fetch(`${API}/api/tourism/poi`),
          fetch(`${API}/api/tourism/events`),
          fetch(`${API}/api/tourism/impact`),
        ]);
        if (!poiRes.ok) throw new Error('Failed to load tourism data');
        setPois(await poiRes.json());
        if (eventRes.ok) setEvents(await eventRes.json());
        if (impactRes.ok) setImpact(await impactRes.json());
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [...new Set(pois.map(p => p.category))];
  const filtered = filter ? pois.filter(p => p.category === filter) : pois;

  if (loading) {
    return (
      <div className="panel h-48 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {impact && (
        <div className="panel p-5 border-l-4" style={{ borderLeftColor: '#10B981' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <span className="eyebrow">Local Economy Impact</span>
          </div>
          <p className="text-sm text-[#38BDF8] leading-relaxed">{impact.interpretation}</p>
          <div className="flex gap-4 mt-3 text-xs text-[#8896A8]">
            <span>{impact.total_footfall.toLocaleString()} daily footfall</span>
            <span>Avg rating: {impact.avg_rating}/5</span>
            <span>{impact.upcoming_events} upcoming events</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-[#FFB020]" />
        <span className="eyebrow">Points of Interest ({filtered.length})</span>
        <div className="ml-auto flex gap-1">
          <button onClick={() => setFilter('')} className={`text-xs px-2 py-1 rounded ${!filter ? 'bg-[#38BDF8]/20 text-[#38BDF8]' : 'text-[#64748B] hover:text-[#38BDF8]'}`}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`text-xs px-2 py-1 rounded capitalize ${filter === cat ? 'bg-[#38BDF8]/20 text-[#38BDF8]' : 'text-[#64748B] hover:text-[#38BDF8]'}`}>
              {CATEGORY_ICONS[cat] || '📍'} {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(poi => (
          <div key={poi.id} className="panel p-4 hover:border-[#38BDF8]/30 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-[#38BDF8] text-sm">{poi.name}</h4>
              <span className="text-xs px-2 py-0.5 rounded bg-[#1B2534] text-[#8896A8] capitalize">{poi.category}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{poi.ward}</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#FFB020]" />{poi.rating}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{poi.footfall_estimate.toLocaleString()}/d</span>
            </div>
          </div>
        ))}
      </div>

      {events.length > 0 && (
        <>
          <div className="flex items-center gap-2 mt-4">
            <Calendar className="w-4 h-4 text-[#8B5CF6]" />
            <span className="eyebrow">Upcoming Local Events</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {events.map(evt => (
              <div key={evt.id} className="panel p-4">
                <h4 className="font-semibold text-[#38BDF8] text-sm">{evt.name}</h4>
                <div className="flex items-center gap-3 mt-2 text-xs text-[#64748B]">
                  <span>{evt.date}</span>
                  <span>{evt.venue}</span>
                  <span>{evt.expected_attendance.toLocaleString()} expected</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TourismPanel;