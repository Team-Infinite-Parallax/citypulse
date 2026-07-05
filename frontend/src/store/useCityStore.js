import { create } from 'zustand';

const useCityStore = create((set) => ({
  selectedRoute: null,
  setSelectedRoute: (route) => set({ selectedRoute: route }),
  
  timeRange: '7d', // 24h, 7d
  setTimeRange: (range) => set({ timeRange: range }),

  queryHistory: [],
  addQuery: (query) => set((state) => ({ queryHistory: [...state.queryHistory, query] })),
}));

export default useCityStore;
