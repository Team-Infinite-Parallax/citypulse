import { create } from 'zustand';

const useCityStore = create((set) => ({
  selectedRoute: '',
  setSelectedRoute: (route) => set({ selectedRoute: route }),

  timeRange: '7d',
  setTimeRange: (range) => set({ timeRange: range }),

  queryHistory: [],
  addQuery: (query) => set((state) => ({ queryHistory: [...state.queryHistory, query] })),

  showIncidents: false,
  setShowIncidents: (show) => set({ showIncidents: show }),

  viewMode: 'planner',
  setViewMode: (mode) => set({ viewMode: mode }),

  accessibilityMode: 'default',
  setAccessibilityMode: (mode) => set({ accessibilityMode: mode }),

  liteMode: false,
  setLiteMode: (lite) => set({ liteMode: lite }),
}));

export default useCityStore;
