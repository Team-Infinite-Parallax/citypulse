import { create } from 'zustand';

const useCityStore = create((set) => ({
  selectedRoute: '',
  setSelectedRoute: (route) => set({ selectedRoute: route }),
  
  timeRange: '7d', // 24h, 7d
  setTimeRange: (range) => set({ timeRange: range }),

  queryHistory: [],
  addQuery: (query) => set((state) => ({ queryHistory: [...state.queryHistory, query] })),

  showIncidents: false,
  setShowIncidents: (show) => set({ showIncidents: show }),
}));

export default useCityStore;
