import { e as createComponent, r as renderTemplate, k as renderSlot, l as renderHead, g as addAttribute, h as createAstro, n as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_CZdgb9a8.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                 */
import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Bar, ComposedChart, Legend, Line, ReferenceLine } from 'recharts';
import { create } from 'zustand';
import { AlertCircle, Filter, Wind, Activity, Clock, Gauge, TrendingUp, Sparkles, ChevronUp, ChevronDown, Database, Bot, Loader2, Send, BarChart2, AlertTriangle, ShieldCheck, MapPin, Lightbulb, HeartPulse, Users, Leaf, Trash2, ShieldAlert, ClipboardList, CheckCircle, Camera } from 'lucide-react';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="generator"', '><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"><title>CityPulse \u2014 Urban Mobility Intelligence</title>', '</head> <body> <header class="site-header border-b border-[var(--glass-border)] backdrop-blur-xl sticky top-0 z-30 shadow-lg transition-colors" style="background: var(--panel)"> <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-5"> <!-- Wordmark --> <a href="/" class="flex items-center gap-2 sm:gap-3 shrink-0 rounded-lg transition-transform hover:scale-105 active:scale-95" aria-label="CityPulse Home"> <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg grid place-items-center font-bold text-base sm:text-lg" style="font-family:var(--font-display); background: var(--amber); color: var(--panel); box-shadow: 0 0 12px rgba(46,168,110,0.12)">C</div> <div class="leading-tight"> <h1 class="text-base sm:text-lg font-bold tracking-tight" style="color: var(--text)">City<span style="color: var(--amber)">Pulse</span></h1> <p class="eyebrow mt-0.5 hidden sm:block">Bengaluru \xB7 Mobility Ops</p> </div> </a> <!-- Signature: live EKG pulse --> <div class="ekg flex-1 h-8 hidden sm:block"> <svg viewBox="0 0 480 32" width="480" height="32" preserveAspectRatio="none" aria-hidden="true"> <path class="trace" d="M0 16 H58 L68 16 L74 4 L80 28 L88 16 H148 L158 16 L164 6 L170 24 L178 16 H240 H298 L308 16 L314 4 L320 28 L328 16 H388 L398 16 L404 6 L410 24 L418 16 H480"></path> </svg> </div> <!-- Live clock / status --> <div class="flex items-center gap-2 sm:gap-3 shrink-0" aria-live="polite"> <span class="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full border border-[#31D0AA]/30 bg-[#31D0AA]/10 shadow-[0_0_10px_rgba(49,208,170,0.15)]"> <span class="livedot" aria-hidden="true"></span> <span class="eyebrow text-[10px] sm:text-[11px]" style="color:var(--flow)">Live</span> </span> <time id="dispatch-clock" class="mono text-sm tabular-nums hidden md:block" style="color:var(--text-mid)" aria-label="Current time">--:--:--</time> </div> </div> </header> <main class="flex-grow" id="main-content"> ', ` </main> <footer class="border-t border-[var(--glass-border)] mt-14 bg-[var(--panel)] backdrop-blur-md"> <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center"> <p class="eyebrow">CityPulse \xB7 Gen AI Academy APAC</p> <p class="eyebrow">Team Infinite Parallax</p> </div> </footer> <script>
			const el = document.getElementById('dispatch-clock');
			const tick = () => { if (el) el.textContent = new Date().toLocaleTimeString('en-GB'); };
			tick(); setInterval(tick, 1000);
		<\/script> </body> </html>`])), addAttribute(Astro2.generator, "content"), renderHead(), renderSlot($$result, $$slots["default"]));
}, "C:/Users/himan/Desktop/citypulse/frontend/src/layouts/Layout.astro", void 0);

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

const features = [{"type":"Feature","properties":{"name":"MG Road"},"geometry":{"type":"LineString","coordinates":[[77.5946,12.9716],[77.6046,12.9726],[77.6146,12.9736]]}},{"type":"Feature","properties":{"name":"Ring Road"},"geometry":{"type":"LineString","coordinates":[[77.5846,12.9616],[77.5946,12.9516],[77.6046,12.9416],[77.6146,12.9516]]}},{"type":"Feature","properties":{"name":"Airport Expressway"},"geometry":{"type":"LineString","coordinates":[[77.6146,12.9736],[77.6246,13],[77.65,13.05],[77.7,13.15]]}},{"type":"Feature","properties":{"name":"Tech Park Avenue"},"geometry":{"type":"LineString","coordinates":[[77.65,12.92],[77.66,12.93],[77.68,12.95]]}},{"type":"Feature","properties":{"name":"Station Road"},"geometry":{"type":"LineString","coordinates":[[77.5746,12.9716],[77.5646,12.9816],[77.5546,12.9716]]}}];
const routesGeoJson = {
  features,
};

const FLOW = "#31D0AA", CAUTION = "#F97316", STOP = "#FF5A5F", AQI_COLOR = "#8B5CF6";
const scoreColor = (v) => v >= 70 ? STOP : v >= 40 ? CAUTION : FLOW;
const KPI_ICONS = {
  congestion: { icon: Gauge, label: "Avg Congestion", unit: "/100" },
  delay: { icon: Clock, label: "Avg Delay", unit: "min" },
  peak: { icon: Activity, label: "Peak Hour", unit: "" },
  aqi: { icon: Wind, label: "Avg AQI", unit: "" }
};
const tooltipStyle = {
  background: "rgba(19, 26, 38, 0.85)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  borderRadius: "12px",
  color: "#31D0AA",
  fontSize: 12
};
const Dashboard = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRoute, setFilterRoute] = useState("");
  const selectedRoute = useCityStore((state) => state.selectedRoute);
  const setSelectedRoute = useCityStore((state) => state.setSelectedRoute);
  const routeNames = useMemo(() => {
    if (!routesGeoJson?.features) return [];
    const names = routesGeoJson.features.map((f) => f.properties?.name).filter(Boolean);
    return [...new Set(names)];
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API = "";
        const [summaryRes, trafficRes, forecastRes] = await Promise.all([
          fetch(`${API}/api/traffic/summary`),
          fetch(`${API}/api/traffic`),
          fetch(`${API}/api/forecast?h=6`)
        ]);
        if (!summaryRes.ok || !trafficRes.ok) throw new Error("Failed to fetch data");
        setSummaryData(await summaryRes.json());
        setTrafficData(await trafficRes.json());
        setForecastData(forecastRes.ok ? await forecastRes.json() : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const activeRoute = filterRoute || selectedRoute || "";
  const displaySummary = activeRoute ? summaryData.filter((s) => s.route_name === activeRoute) : summaryData;
  const displayTraffic = activeRoute ? trafficData.filter((t) => t.route_name === activeRoute) : trafficData;
  const delayChartData = displaySummary.map((s) => ({ name: s.route_name, Delay: s.avg_delay_minutes }));
  const sortedTraffic = [...displayTraffic].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const trendDataRaw = {};
  sortedTraffic.forEach((t) => {
    const time = new Date(t.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (!trendDataRaw[time]) trendDataRaw[time] = { time, congestion: 0, count: 0 };
    trendDataRaw[time].congestion += t.congestion;
    trendDataRaw[time].count += 1;
  });
  const trendData = Object.values(trendDataRaw).map((d) => ({ time: d.time, Congestion: Math.round(d.congestion / d.count) })).slice(-24);
  const activeForecast = useMemo(() => {
    if (!forecastData.length) return null;
    if (activeRoute) return forecastData.find((f) => f.route_name === activeRoute) || null;
    return [...forecastData].sort((a, b) => b.current_congestion - a.current_congestion)[0];
  }, [forecastData, activeRoute]);
  const forecastChartData = useMemo(() => {
    if (!activeForecast) return [];
    const hist = activeForecast.history.slice(-24).map((h) => ({
      ts: h.ts,
      label: h.label,
      Actual: h.congestion
    }));
    if (hist.length) {
      const lastActual = hist[hist.length - 1].Actual;
      hist[hist.length - 1] = {
        ...hist[hist.length - 1],
        Forecast: lastActual,
        range: [lastActual, lastActual]
      };
    }
    const fc = activeForecast.forecast_series.map((f) => ({
      ts: f.ts,
      label: f.label,
      Forecast: f.forecast,
      range: [f.lower, f.upper]
    }));
    return [...hist, ...fc];
  }, [activeForecast]);
  const boundaryTs = activeForecast?.forecast_series?.[0]?.ts;
  const fmtHour = (ts) => {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, "0")}:00`;
  };
  const overallAvgCongestion = displaySummary.length > 0 ? Math.round(displaySummary.reduce((a, s) => a + s.avg_congestion, 0) / displaySummary.length) : 0;
  const overallAvgDelay = displaySummary.length > 0 ? Math.round(displaySummary.reduce((a, s) => a + s.avg_delay_minutes, 0) / displaySummary.length) : 0;
  const peakHour = displaySummary.length === 1 ? displaySummary[0].peak_hour : displaySummary.length > 1 ? "Var" : "--";
  const overallAvgAqi = displayTraffic.length > 0 ? Math.round(displayTraffic.reduce((a, t) => a + (t.aqi || 50), 0) / displayTraffic.length) : 50;
  const congColor = scoreColor(overallAvgCongestion);
  const kpiCards = [
    {
      key: "congestion",
      value: overallAvgCongestion,
      unit: "/100",
      color: congColor,
      extra: /* @__PURE__ */ React.createElement("div", { className: "mt-3 h-1.5 rounded-full bg-[#0E141E] overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-full rounded-full transition-all", style: { width: `${overallAvgCongestion}%`, background: congColor } }))
    },
    {
      key: "delay",
      value: overallAvgDelay,
      unit: "min",
      color: "#F97316",
      extra: /* @__PURE__ */ React.createElement("p", { className: "mono text-[11px] text-[#8896A8] mt-3" }, "vs. free-flow baseline")
    },
    {
      key: "peak",
      value: peakHour,
      unit: "",
      color: "#31D0AA",
      extra: /* @__PURE__ */ React.createElement("p", { className: "mono text-[11px] text-[#8896A8] mt-3" }, "busiest window")
    },
    {
      key: "aqi",
      value: overallAvgAqi,
      unit: "",
      color: AQI_COLOR,
      extra: /* @__PURE__ */ React.createElement("p", { className: "mono text-[11px] text-[#8896A8] mt-3" }, "air quality index")
    }
  ];
  const handleRouteFilter = (e) => {
    const val = e.target.value;
    setFilterRoute(val);
    setSelectedRoute(val);
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel h-64 flex flex-col justify-center items-center gap-3", "aria-live": "polite" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 border-2 border-[#FFB020] border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, "Loading telemetry…"));
  }
  if (error) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel p-6 flex items-center text-[#FF9497] border-[#FF5A5F]/30", "aria-live": "assertive" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "w-6 h-6 mr-3 flex-shrink-0" }), /* @__PURE__ */ React.createElement("p", { className: "font-semibold" }, error));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 route-filter" }, /* @__PURE__ */ React.createElement(Filter, { className: "filter-icon" }), /* @__PURE__ */ React.createElement(
    "select",
    {
      "aria-label": "Filter by route",
      value: activeRoute,
      onChange: handleRouteFilter,
      className: "route-select"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "All routes"),
    routeNames.map((name) => /* @__PURE__ */ React.createElement("option", { key: name, value: name }, name))
  ), activeRoute && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => {
        setFilterRoute("");
        setSelectedRoute("");
      },
      className: "text-xs clear-filter hover:text-[#31D0AA] transition-colors px-2 py-1"
    },
    "Clear filter"
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4" }, kpiCards.map(({ key, value, unit, color, extra }) => {
    const meta = KPI_ICONS[key];
    const Icon = meta.icon;
    return /* @__PURE__ */ React.createElement("div", { key, className: "panel p-4 sm:p-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-3" }, /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, meta.label), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "w-8 h-8 rounded-lg grid place-items-center border",
        style: { background: `${color}1a`, borderColor: `${color}44`, color }
      },
      /* @__PURE__ */ React.createElement(Icon, { className: "w-4 h-4" })
    )), /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-1.5" }, /* @__PURE__ */ React.createElement("span", { className: "stat text-2xl sm:text-4xl", style: { color: key === "congestion" ? color : "#31D0AA" } }, value), unit && /* @__PURE__ */ React.createElement("span", { className: "text-[#8896A8] text-sm" }, unit)), extra);
  })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "panel" }, /* @__PURE__ */ React.createElement("div", { className: "panel-head" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-semibold text-[#31D0AA]" }, "Congestion Trend · 24h"), /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, activeRoute || "All corridors")), /* @__PURE__ */ React.createElement("div", { className: "p-4 h-64" }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(AreaChart, { data: trendData, margin: { top: 8, right: 8, left: -12, bottom: 0 } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "congFill", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: FLOW, stopOpacity: 0.35 }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: FLOW, stopOpacity: 0 }))), /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#1B2534" }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "time", stroke: "#8896A8", fontSize: 12, tickMargin: 8, minTickGap: 30, tickLine: false, axisLine: { stroke: "#1B2534" } }), /* @__PURE__ */ React.createElement(YAxis, { stroke: "#8896A8", fontSize: 12, tickLine: false, axisLine: false }), /* @__PURE__ */ React.createElement(Tooltip, { cursor: { stroke: "#263244" }, contentStyle: tooltipStyle }), /* @__PURE__ */ React.createElement(
    Area,
    {
      type: "monotone",
      dataKey: "Congestion",
      stroke: FLOW,
      strokeWidth: 2.5,
      fill: "url(#congFill)",
      dot: false,
      activeDot: { r: 5, fill: FLOW, stroke: "#0B0E14", strokeWidth: 2 }
    }
  ))))), /* @__PURE__ */ React.createElement("div", { className: "panel" }, /* @__PURE__ */ React.createElement("div", { className: "panel-head" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-semibold text-[#31D0AA]" }, "Avg Delay by Route"), /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, "minutes")), /* @__PURE__ */ React.createElement("div", { className: "p-4 h-64" }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(BarChart, { data: delayChartData, margin: { top: 8, right: 8, left: -12, bottom: 0 } }, /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#1B2534" }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "name", stroke: "#8896A8", fontSize: 12, tickMargin: 8, tickLine: false, axisLine: { stroke: "#1B2534" } }), /* @__PURE__ */ React.createElement(YAxis, { stroke: "#8896A8", fontSize: 12, tickLine: false, axisLine: false }), /* @__PURE__ */ React.createElement(Tooltip, { cursor: { fill: "rgba(255,255,255,0.04)" }, contentStyle: tooltipStyle }), /* @__PURE__ */ React.createElement(Bar, { dataKey: "Delay", fill: CAUTION, radius: [4, 4, 0, 0], maxBarSize: 44 })))))), activeForecast && /* @__PURE__ */ React.createElement("div", { className: "panel" }, /* @__PURE__ */ React.createElement("div", { className: "panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(TrendingUp, { className: "w-4 h-4 text-[#31D0AA]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-base font-semibold text-[#31D0AA]" }, "Congestion Forecast · next ", activeForecast.horizon_hours, "h")), /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, activeForecast.route_name, " · 90% band")), /* @__PURE__ */ React.createElement("div", { className: "p-4 h-72" }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(ComposedChart, { data: forecastChartData, margin: { top: 8, right: 12, left: -12, bottom: 0 } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "bandFill", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "#31D0AA", stopOpacity: 0.28 }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "#31D0AA", stopOpacity: 0.06 }))), /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#1B2534" }), /* @__PURE__ */ React.createElement(
    XAxis,
    {
      dataKey: "ts",
      tickFormatter: fmtHour,
      stroke: "#8896A8",
      fontSize: 11,
      tickMargin: 8,
      minTickGap: 28,
      tickLine: false,
      axisLine: { stroke: "#1B2534" }
    }
  ), /* @__PURE__ */ React.createElement(YAxis, { domain: [0, 100], stroke: "#8896A8", fontSize: 12, tickLine: false, axisLine: false }), /* @__PURE__ */ React.createElement(
    Tooltip,
    {
      cursor: { stroke: "#263244" },
      contentStyle: tooltipStyle,
      labelFormatter: (ts) => {
        const p = forecastChartData.find((d) => d.ts === ts);
        return p ? p.label : ts;
      },
      formatter: (value, name) => {
        if (name === "Uncertainty band" && Array.isArray(value))
          return [`${value[0]}–${value[1]}`, name];
        return [value, name];
      }
    }
  ), /* @__PURE__ */ React.createElement(Legend, { wrapperStyle: { fontSize: 12 } }), /* @__PURE__ */ React.createElement(
    Area,
    {
      type: "monotone",
      dataKey: "range",
      name: "Uncertainty band",
      stroke: "none",
      fill: "url(#bandFill)",
      connectNulls: false,
      isAnimationActive: false
    }
  ), /* @__PURE__ */ React.createElement(
    Line,
    {
      type: "monotone",
      dataKey: "Actual",
      name: "Actual",
      stroke: "#8896A8",
      strokeWidth: 2,
      dot: false,
      connectNulls: false,
      isAnimationActive: false
    }
  ), /* @__PURE__ */ React.createElement(
    Line,
    {
      type: "monotone",
      dataKey: "Forecast",
      name: "Forecast",
      stroke: "#31D0AA",
      strokeWidth: 2.5,
      strokeDasharray: "5 4",
      dot: false,
      connectNulls: true,
      isAnimationActive: false
    }
  ), boundaryTs && /* @__PURE__ */ React.createElement(
    ReferenceLine,
    {
      x: boundaryTs,
      stroke: "#FFB020",
      strokeDasharray: "2 4",
      label: { value: "now", position: "top", fill: "#FFB020", fontSize: 10 }
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "px-4 pb-4 -mt-1" }, /* @__PURE__ */ React.createElement("p", { className: "mono text-[11px] text-[#64748B]" }, activeForecast.method, activeForecast.params?.alpha != null && /* @__PURE__ */ React.createElement(React.Fragment, null, " · α=", activeForecast.params.alpha, " β=", activeForecast.params.beta, activeForecast.params.gamma != null && /* @__PURE__ */ React.createElement(React.Fragment, null, " γ=", activeForecast.params.gamma)), " · σ=", activeForecast.residual_std))));
};

const LABEL_COLOR = { high: "#31D0AA", medium: "#FFB020", low: "#8896A8" };
const SourceRow = ({ source }) => {
  if (source && typeof source === "object" && "similarity" in source) {
    const name = source.route_name || source.ward || source.key || "source";
    return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-2 bg-[#0E141E] px-3 py-2 rounded-lg border border-[#1B2534]" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#31D0AA] font-medium truncate" }, name), /* @__PURE__ */ React.createElement("span", { className: "mono text-[11px] text-[#31D0AA] flex-shrink-0" }, "sim ", Number(source.similarity).toFixed(3)));
  }
  return /* @__PURE__ */ React.createElement("pre", { className: "text-[11px] font-mono bg-[#0E141E] p-2.5 rounded-lg overflow-x-auto text-[#9AA9BD] border border-[#1B2534] custom-scrollbar" }, JSON.stringify(source, null, 2));
};
const ExplainabilityPanel = ({ explain, title = "Why this answer?", defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  if (!explain) return null;
  const {
    confidence = 0,
    confidence_label = "low",
    rationale,
    sources = [],
    method
  } = explain;
  const color = LABEL_COLOR[confidence_label] || "#8896A8";
  const pct = Math.round(Math.max(0, Math.min(1, confidence)) * 100);
  return /* @__PURE__ */ React.createElement("div", { className: "mt-4 border border-[#263244] rounded-xl overflow-hidden" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      "aria-expanded": open,
      className: "w-full px-4 py-3 bg-[#0E141E] flex items-center justify-between gap-3 text-sm font-medium text-[#9AA9BD] hover:bg-[#182233] transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFB020]",
      onClick: () => setOpen(!open)
    },
    /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "w-3.5 h-3.5 text-[#FFB020]" }), title),
    /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
      "span",
      {
        className: "mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider",
        style: { background: `${color}1f`, color }
      },
      confidence_label,
      " · ",
      pct,
      "%"
    ), open ? /* @__PURE__ */ React.createElement(ChevronUp, { className: "w-4 h-4" }) : /* @__PURE__ */ React.createElement(ChevronDown, { className: "w-4 h-4" }))
  ), open && /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-[#131A26] border-t border-[#263244] space-y-4" }, rationale && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#31D0AA] leading-relaxed" }, rationale), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-1.5" }, /* @__PURE__ */ React.createElement(Gauge, { className: "w-3.5 h-3.5 text-[#8896A8]" }), /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, "Confidence / relevance")), /* @__PURE__ */ React.createElement("div", { className: "h-1.5 rounded-full bg-[#0E141E] overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-full rounded-full transition-all", style: { width: `${pct}%`, background: color } }))), sources && sources.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(Database, { className: "w-3.5 h-3.5 text-[#8896A8]" }), /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, "Sources used (", sources.length, ")")), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 max-h-56 overflow-y-auto custom-scrollbar" }, sources.map((s, i) => /* @__PURE__ */ React.createElement(SourceRow, { key: i, source: s })))), method && /* @__PURE__ */ React.createElement("p", { className: "mono text-[11px] text-[#64748B]" }, "Method: ", method)));
};

const QueryBar = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const addQueryToHistory = useCityStore((state) => state.addQuery);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const API = "";
      const res = await fetch(`${API}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query })
      });
      if (!res.ok) throw new Error("Failed to fetch AI response");
      const data = await res.json();
      setResponse(data);
      addQueryToHistory({ question: query, ...data });
    } catch (err) {
      console.error(err);
      setError("Sorry, we couldn't connect to the AI service. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "panel p-5 mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-3" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "w-3.5 h-3.5 text-[#FFB020]" }), /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, "Ask the city")), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "relative" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center bg-[#E8F9EE] border border-[#6EE3A0] rounded-xl overflow-hidden focus-within:border-[#6EE3A0] transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "pl-4 text-[#4EBF79]" }, /* @__PURE__ */ React.createElement(Bot, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "query-input",
      name: "query",
      type: "text",
      autoComplete: "off",
      "aria-label": "Ask the city",
      className: "flex-1 bg-transparent border-none py-4 px-4 text-[#11502B] placeholder-[#6A8B6F] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
      placeholder: "e.g. Which corridor has the worst congestion right now?…",
      value: query,
      onChange: (e) => setQuery(e.target.value),
      disabled: loading
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      disabled: !query.trim() || loading,
      className: "btn-signal px-6 py-4 flex items-center gap-2 active:scale-95 transition-transform"
    },
    loading ? /* @__PURE__ */ React.createElement(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Send, { className: "w-4 h-4" }), " Ask")
  ))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex flex-wrap gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setQuery("Which ward has the most incidents and worst AQI?"),
      className: "text-xs px-3 py-1.5 rounded-full bg-[#1B2534] text-[#8896A8] hover:bg-[#263244] hover:text-[#31D0AA] transition-colors border border-[#263244]"
    },
    "Which ward has the most incidents and worst AQI?"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setQuery("Is there a correlation between traffic congestion and air quality today?"),
      className: "text-xs px-3 py-1.5 rounded-full bg-[#1B2534] text-[#8896A8] hover:bg-[#263244] hover:text-[#31D0AA] transition-colors border border-[#263244]"
    },
    "Traffic congestion vs AQI correlation?"
  )), error && /* @__PURE__ */ React.createElement("div", { className: "mt-4 bg-[#FF5A5F]/10 text-[#FF9497] p-4 rounded-xl border border-[#FF5A5F]/30 flex items-start", "aria-live": "assertive" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "w-5 h-5 mr-3 mt-0.5 flex-shrink-0" }), /* @__PURE__ */ React.createElement("p", null, error)), response && /* @__PURE__ */ React.createElement("div", { className: "mt-6 border-t border-[var(--glass-border)] pt-6", "aria-live": "polite" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-lg bg-[#31D0AA]/12 flex items-center justify-center text-[#31D0AA] mr-4 flex-shrink-0 border border-[#31D0AA]/25" }, /* @__PURE__ */ React.createElement(Bot, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("h4", { className: "eyebrow mb-1.5" }, "CityPulse AI"), /* @__PURE__ */ React.createElement("p", { className: "text-[#31D0AA] text-lg leading-relaxed" }, response.answer))), response.chart_data && response.chart_data.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-6 mb-6 bg-[#0E141E] p-4 rounded-xl border border-[#1B2534] h-80 flex flex-col" }, /* @__PURE__ */ React.createElement("h5", { className: "eyebrow mb-4 flex items-center flex-shrink-0" }, /* @__PURE__ */ React.createElement(BarChart2, { className: "w-3.5 h-3.5 mr-2" }), " Data Visualization"), /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-h-0 w-full" }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(BarChart, { data: response.chart_data }, /* @__PURE__ */ React.createElement(XAxis, { dataKey: "label", stroke: "#64748B", fontSize: 12 }), /* @__PURE__ */ React.createElement(YAxis, { stroke: "#64748B", fontSize: 12 }), /* @__PURE__ */ React.createElement(Tooltip, { cursor: { fill: "rgba(255,255,255,0.04)" }, contentStyle: { background: "#131A26", border: "1px solid #263244", borderRadius: "10px", color: "#31D0AA" } }), /* @__PURE__ */ React.createElement(Bar, { dataKey: "value", fill: "#FFB020", radius: [4, 4, 0, 0] }))))), response.explain && /* @__PURE__ */ React.createElement(ExplainabilityPanel, { explain: response.explain, title: "Why this answer?" })));
};

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const API = "";
        const res = await fetch(`${API}/api/alerts`);
        if (!res.ok) throw new Error("Failed to fetch alerts");
        setAlerts(await res.json());
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load alerts.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel h-64 flex flex-col justify-center items-center gap-3", "aria-live": "polite" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 border-2 border-[#FF5A5F] border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, "Scanning for anomalies…"));
  }
  if (error) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel p-5 flex items-center text-[#FF9497] border-[#FF5A5F]/30", "aria-live": "assertive" }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: "w-5 h-5 mr-3 flex-shrink-0" }), /* @__PURE__ */ React.createElement("p", { className: "font-semibold text-sm" }, error));
  }
  if (alerts.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel h-64 flex flex-col justify-center items-center text-center px-6" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-full grid place-items-center mb-3 border border-[#31D0AA]/30 bg-[#31D0AA]/12 text-[#31D0AA]" }, /* @__PURE__ */ React.createElement(ShieldCheck, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-[#31D0AA]" }, "All Clear"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#64748B] mt-1" }, "No anomalies in the network."));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "panel" }, /* @__PURE__ */ React.createElement("div", { className: "panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: "w-4 h-4 text-[#FF5A5F]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-base font-semibold text-[#31D0AA]" }, "Active Anomalies")), /* @__PURE__ */ React.createElement("span", { className: "mono text-xs px-2 py-0.5 rounded-full bg-[#FF5A5F]/12 text-[#FF9497] border border-[#FF5A5F]/25" }, alerts.length)), /* @__PURE__ */ React.createElement("div", { className: "p-4 space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar" }, alerts.map((alert) => {
    const critical = alert.severity === "CRITICAL";
    const accent = critical ? "#FF5A5F" : "#FFB020";
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: alert.id,
        className: "rounded-xl bg-[#0E141E] border border-[#1B2534] p-4 hover:border-[#FF5A5F]/50 transition-all hover:-translate-y-0.5 shadow-lg",
        style: { borderLeft: `3px solid ${accent}` }
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-2" }, /* @__PURE__ */ React.createElement(
        "span",
        {
          className: "mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider",
          style: { background: `${accent}1f`, color: accent }
        },
        alert.severity
      ), /* @__PURE__ */ React.createElement("span", { className: "flex items-center mono text-[11px] text-[#64748B]" }, /* @__PURE__ */ React.createElement(Clock, { className: "w-3 h-3 mr-1" }), new Date(alert.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))),
      /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-[#31D0AA] mb-1 flex items-center text-sm" }, /* @__PURE__ */ React.createElement(MapPin, { className: "w-3.5 h-3.5 mr-1.5 text-[#64748B]" }), alert.route_name),
      /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#9AA9BD] mb-3 leading-relaxed" }, alert.message),
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mono text-[11px]" }, /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]" }, "Congestion ", /* @__PURE__ */ React.createElement("span", { className: "text-[#31D0AA]" }, alert.metrics.congestion), "/100"), /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]" }, "Delay ", /* @__PURE__ */ React.createElement("span", { className: "text-[#31D0AA]" }, alert.metrics.delay), "m")),
      alert.explain && /* @__PURE__ */ React.createElement(ExplainabilityPanel, { explain: alert.explain, title: "Why flagged?" })
    );
  })));
};

const RecommendationCard = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const API = "";
        const res = await fetch(`${API}/api/recommendations`);
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        const data = await res.json();
        setRecommendations(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load AI recommendations.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel h-64 flex flex-col justify-center items-center", "aria-live": "polite" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 border-4 border-[#31D0AA] border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ React.createElement("p", { className: "mt-3 text-sm font-medium text-[#9AA9BD]" }, "Generating AI Recommendations…"));
  }
  if (error) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel p-5 flex items-center text-[#FF9497] border border-[#FF5A5F]/30", "aria-live": "assertive" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "w-5 h-5 mr-3 flex-shrink-0" }), /* @__PURE__ */ React.createElement("p", { className: "font-semibold text-sm" }, error));
  }
  if (recommendations.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel h-64 flex flex-col justify-center items-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-[#31D0AA]/10 text-[#31D0AA] border border-[#31D0AA]/20 rounded-full flex items-center justify-center mb-3 shadow-[0_0_12px_rgba(49,208,170,0.15)]" }, /* @__PURE__ */ React.createElement(Lightbulb, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-[#31D0AA]" }, "No Action Needed"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#9AA9BD] mt-1" }, "Traffic patterns are within normal parameters."));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "panel h-full flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "panel-head" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold flex items-center", style: { color: "var(--amber)" } }, /* @__PURE__ */ React.createElement(Sparkles, { className: "w-4 h-4 mr-2", style: { color: "var(--amber)" } }), "AI Recommendations (", recommendations.length, ")")), /* @__PURE__ */ React.createElement("div", { className: "p-4 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar flex-grow" }, recommendations.map((rec) => /* @__PURE__ */ React.createElement("div", { key: rec.id, className: "border border-[#1B2534] rounded-xl overflow-hidden bg-[#0E141E] hover:border-[#FFB020]/50 transition-all hover:-translate-y-0.5 shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "mono text-[10px] font-bold px-2 py-1 rounded tracking-wider bg-[#31D0AA]/10 text-[#31D0AA] border border-[#31D0AA]/20 uppercase" }, rec.route_name), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium text-[#9AA9BD] px-2 py-1 bg-[#131A26] border border-[#263244] rounded" }, rec.issue)), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex items-start" }, /* @__PURE__ */ React.createElement(Lightbulb, { className: "w-4 h-4 text-[#FFB020] mr-2 flex-shrink-0 mt-0.5" }), /* @__PURE__ */ React.createElement("p", { className: "text-[#31D0AA] text-sm font-medium leading-relaxed" }, rec.suggestion)), rec.explain && /* @__PURE__ */ React.createElement(ExplainabilityPanel, { explain: rec.explain, title: "Why this recommendation?" }))))));
};

const riskColor = (level) => ({
  LOW: "#31D0AA",
  MODERATE: "#FFB020",
  ELEVATED: "#FF9F1C",
  HIGH: "#FF5A5F",
  SEVERE: "#FF3B5C"
})[level] || "#9AA9BD";
const HealthAdvisory = () => {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchAdvisories = async () => {
      try {
        setLoading(true);
        const API = "";
        const res = await fetch(`${API}/api/advisories`);
        if (!res.ok) throw new Error("Failed to fetch advisories");
        setAdvisories(await res.json());
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load health advisories.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisories();
  }, []);
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel h-64 flex flex-col justify-center items-center gap-3", "aria-live": "polite" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, "Cross-referencing AQI & congestion…"));
  }
  if (error) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel p-5 flex items-center text-[#FF9497] border-[#FF5A5F]/30", "aria-live": "assertive" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "w-5 h-5 mr-3 flex-shrink-0" }), /* @__PURE__ */ React.createElement("p", { className: "font-semibold text-sm" }, error));
  }
  const actionable = advisories.filter((a) => a.risk_level !== "LOW");
  return /* @__PURE__ */ React.createElement("div", { className: "panel h-full flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(HeartPulse, { className: "w-4 h-4 text-[#8B5CF6]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-base font-semibold text-[#31D0AA]" }, "Health & Air-Quality Advisories")), /* @__PURE__ */ React.createElement("span", { className: "mono text-xs px-2 py-0.5 rounded-full bg-[#8B5CF6]/12 text-[#C4B5FD] border border-[#8B5CF6]/25" }, actionable.length, " active")), /* @__PURE__ */ React.createElement("div", { className: "p-4 space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar flex-grow" }, advisories.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "h-40 flex flex-col justify-center items-center text-center" }, /* @__PURE__ */ React.createElement(ShieldCheck, { className: "w-8 h-8 text-[#31D0AA] mb-2" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#9AA9BD]" }, "No air-quality data available.")), advisories.map((a) => {
    const accent = riskColor(a.risk_level);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: a.id,
        className: "rounded-xl bg-[#0E141E] border border-[#1B2534] p-4 shadow-lg",
        style: { borderLeft: `3px solid ${accent}` }
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-[#31D0AA] text-sm" }, a.route_name), /* @__PURE__ */ React.createElement(
        "span",
        {
          className: "mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider",
          style: { background: `${accent}1f`, color: accent }
        },
        a.risk_level
      )),
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-3 mono text-[11px]" }, /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD] flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Wind, { className: "w-3 h-3" }), " AQI ", /* @__PURE__ */ React.createElement("span", { className: "text-[#31D0AA]" }, a.peak_aqi)), /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]" }, a.aqi_category), /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]" }, "Cong ", /* @__PURE__ */ React.createElement("span", { className: "text-[#31D0AA]" }, a.peak_congestion), "/100")),
      /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#9AA9BD] leading-relaxed mb-3" }, a.advisory),
      /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-1.5 text-[11px] text-[#64748B]" }, /* @__PURE__ */ React.createElement(Users, { className: "w-3.5 h-3.5 mt-0.5 flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", null, a.vulnerable_groups.join(" · ")))
    );
  })));
};

const WardDetailPanel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchLivability = async () => {
      try {
        setLoading(true);
        const API = "";
        const res = await fetch(`${API}/api/environment/livability`);
        if (!res.ok) throw new Error("Failed to fetch livability data");
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load ward livability scores.");
      } finally {
        setLoading(false);
      }
    };
    fetchLivability();
  }, []);
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel p-6 flex items-center justify-center h-48" }, /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 border-2 border-[#31D0AA] border-t-transparent rounded-full animate-spin" }));
  }
  if (error) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel p-6 text-[#FF9497] flex items-center gap-2" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "w-5 h-5" }), error);
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, data.map((ward) => /* @__PURE__ */ React.createElement("div", { key: ward.ward, className: "panel p-5 space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-lg text-[#31D0AA]" }, ward.ward), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "eyebrow text-[#31D0AA]" }, "Livability Score"), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 rounded text-sm font-bold ${ward.livability_score >= 80 ? "bg-[#10b981]/20 text-[#10b981]" : ward.livability_score >= 60 ? "bg-[#f97316]/20 text-[#f97316]" : "bg-[#ef4444]/20 text-[#ef4444]"}` }, ward.livability_score, "/100"))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 text-[#8896A8] text-xs uppercase tracking-wider" }, /* @__PURE__ */ React.createElement(Leaf, { className: "w-3.5 h-3.5" }), "AQI"), /* @__PURE__ */ React.createElement("span", { className: "text-xl font-semibold text-[#31D0AA]" }, ward.aqi)), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 text-[#8896A8] text-xs uppercase tracking-wider" }, /* @__PURE__ */ React.createElement(Trash2, { className: "w-3.5 h-3.5" }), "Waste Eff."), /* @__PURE__ */ React.createElement("span", { className: "text-xl font-semibold text-[#31D0AA]" }, ward.waste_efficiency, "%")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 text-[#8896A8] text-xs uppercase tracking-wider" }, /* @__PURE__ */ React.createElement(ShieldAlert, { className: "w-3.5 h-3.5" }), "Incidents"), /* @__PURE__ */ React.createElement("span", { className: "text-xl font-semibold text-[#31D0AA]" }, ward.incident_rate))), /* @__PURE__ */ React.createElement("div", { className: "pt-3 border-t border-[#263244]" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#8896A8] italic" }, '" ', ward.interpretation, ' "')))));
};

const ActionCenter = () => {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchMemos();
  }, []);
  const fetchMemos = async () => {
    try {
      setLoading(true);
      const API = "";
      const res = await fetch(`${API}/api/actions/memos`);
      if (!res.ok) throw new Error("Failed to fetch action memos");
      const data = await res.json();
      setMemos(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load action center memos.");
    } finally {
      setLoading(false);
    }
  };
  const handleDispatch = async (id) => {
    try {
      const API = "";
      const res = await fetch(`${API}/api/actions/dispatch/${id}`, { method: "POST" });
      if (res.ok) {
        fetchMemos();
      }
    } catch (err) {
      console.error("Failed to dispatch memo:", err);
    }
  };
  const handleTestDraft = async () => {
    try {
      const API = "";
      const res = await fetch(`${API}/api/actions/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "TEST_ANOMALY", details: "High congestion on Main St." })
      });
      if (res.ok) {
        fetchMemos();
      }
    } catch (err) {
      console.error("Failed to draft memo:", err);
    }
  };
  if (loading && memos.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "panel p-6 flex items-center justify-center h-48" }, /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 border-2 border-[#31D0AA] border-t-transparent rounded-full animate-spin" }));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-[#31D0AA] flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ClipboardList, { className: "w-5 h-5 text-[#FFB020]" }), " Action Center"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleTestDraft,
      className: "text-xs px-3 py-1.5 rounded bg-[#1B2534] border border-[#263244] text-[#31D0AA] hover:bg-[#263244] transition-colors"
    },
    "+ Draft Test Memo"
  )), error && /* @__PURE__ */ React.createElement("p", { className: "text-[#FF9497] text-sm" }, error), memos.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#8896A8] italic" }, "No action memos generated yet.") : memos.map((memo) => /* @__PURE__ */ React.createElement("div", { key: memo.id, className: "panel p-5 border border-[#263244] hover:border-[#31D0AA]/30 transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-[#31D0AA]" }, memo.title), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#8896A8] mt-1 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: "w-3 h-3" }), " Dept: ", memo.department)), /* @__PURE__ */ React.createElement("span", { className: `text-xs px-2 py-1 rounded font-bold ${memo.status === "DISPATCHED" ? "bg-[#10b981]/20 text-[#10b981]" : "bg-[#f97316]/20 text-[#f97316]"}` }, memo.status)), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#31D0AA] mb-3" }, memo.justification), /* @__PURE__ */ React.createElement("div", { className: "bg-[#0B0E14] p-3 rounded text-sm mb-4" }, /* @__PURE__ */ React.createElement("span", { className: "eyebrow block mb-2 text-[#8896A8]" }, "Action Items:"), /* @__PURE__ */ React.createElement("ul", { className: "list-disc pl-4 text-[#31D0AA] space-y-1" }, memo.action_items?.map((item, idx) => /* @__PURE__ */ React.createElement("li", { key: idx }, item)))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center pt-3 border-t border-[#263244]" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#64748B] flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Clock, { className: "w-3.5 h-3.5" }), new Date(memo.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })), memo.status === "DRAFT" && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => handleDispatch(memo.id),
      className: "flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-[#31D0AA] text-[#0B0E14] rounded hover:bg-[#31D0AA]/90 transition-colors"
    },
    /* @__PURE__ */ React.createElement(CheckCircle, { className: "w-4 h-4" }),
    " Approve & Dispatch"
  )))));
};

const CitizenReport = () => {
  const [text, setText] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
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
      const API = "";
      const res = await fetch(`${API}/api/citizen/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          photoBase64,
          ward: "Gomti Nagar",
          // Default mock ward
          lat: 12.975,
          lng: 77.61
        })
      });
      if (!res.ok) throw new Error("Failed to submit report");
      setSuccess(true);
      setText("");
      setPhotoBase64("");
      setTimeout(() => setSuccess(false), 3e3);
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "panel p-5" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-[#31D0AA] mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "w-1 h-5 rounded-full bg-[#3b82f6]" }), "Citizen Report"), success ? /* @__PURE__ */ React.createElement("div", { className: "bg-[#10b981]/10 text-[#10b981] p-4 rounded-lg flex items-center gap-3 border border-[#10b981]/20" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "w-5 h-5" }), /* @__PURE__ */ React.createElement("p", { className: "font-semibold text-sm" }, "Report submitted successfully!")) : /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "w-full bg-[#0E141E] border border-[#263244] rounded-lg p-3 text-sm text-[#31D0AA] placeholder-[#64748B] focus:border-[#3b82f6] focus:outline-none transition-colors min-h-[100px] resize-none",
      placeholder: "Describe the issue (e.g., severe pothole on Main St, uncollected garbage...)",
      value: text,
      onChange: (e) => setText(e.target.value)
    }
  )), error && /* @__PURE__ */ React.createElement("p", { className: "text-[#FF9497] text-xs" }, error), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 cursor-pointer text-sm text-[#8896A8] hover:text-[#31D0AA] transition-colors" }, /* @__PURE__ */ React.createElement(Camera, { className: "w-4 h-4" }), /* @__PURE__ */ React.createElement("span", null, photoBase64 ? "Photo Attached" : "Attach Photo"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      accept: "image/*",
      className: "hidden",
      onChange: handlePhotoUpload
    }
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      disabled: loading || !text && !photoBase64,
      className: "btn-signal bg-[#3b82f6]/20 text-[#3b82f6] hover:bg-[#3b82f6]/30 px-4 py-2 flex items-center gap-2 border border-[#3b82f6]/30 disabled:opacity-50"
    },
    loading ? /* @__PURE__ */ React.createElement(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Send, { className: "w-4 h-4" }), " Submit")
  ))));
};

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-4 sm:p-6 lg:p-8"> <div class="max-w-[1600px] mx-auto space-y-8 lg:space-y-10"> <!-- Query Bar --> ${renderComponent($$result2, "QueryBar", QueryBar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/QueryBar.jsx", "client:component-export": "default" })} <!-- Map: Hero section - full width, dominant --> <section aria-label="Traffic Map" class="relative"> <div class="flex items-center gap-2 mb-4"> <span class="w-1 h-5 rounded-full bg-[#31D0AA] shadow-[0_0_8px_rgba(49,208,170,0.6)]"></span> <h2 class="text-lg font-bold" style="color: var(--amber)">Traffic Map</h2> <span class="eyebrow ml-auto hidden sm:block">Bengaluru · Live Network</span> </div> <div class="relative"> ${renderComponent($$result2, "MapView", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/MapView.jsx", "client:component-export": "default" })} <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0B0E14] to-transparent rounded-b-[16px]"></div> </div> </section> <!-- Second domain: Environmental / Community Wellness --> <section aria-label="Health & Air-Quality Advisories"> ${renderComponent($$result2, "HealthAdvisory", HealthAdvisory, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/HealthAdvisory.jsx", "client:component-export": "default" })} </section> <!-- Live Telemetry --> <section aria-label="Live Telemetry"> <div class="flex items-center gap-2 mb-4"> <span class="w-1 h-5 rounded-full bg-[#31D0AA] shadow-[0_0_8px_rgba(49,208,170,0.6)]"></span> <h2 class="text-lg font-bold" style="color: var(--amber)">Live Telemetry</h2> </div> ${renderComponent($$result2, "Dashboard", Dashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/Dashboard.jsx", "client:component-export": "default" })} </section> <!-- Alerts + AI Recommendations --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"> ${renderComponent($$result2, "AlertsPanel", AlertsPanel, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/AlertsPanel.jsx", "client:component-export": "default" })} ${renderComponent($$result2, "RecommendationCard", RecommendationCard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/RecommendationCard.jsx", "client:component-export": "default" })} </div> <!-- Phase 2: Environment Ward Details --> <section aria-label="Ward Livability"> <h2 class="text-lg font-bold text-[#31D0AA] mb-4 flex items-center gap-2"> <span class="w-1 h-5 rounded-full bg-[#10b981]"></span>
Ward Livability Score
</h2> ${renderComponent($$result2, "WardDetailPanel", WardDetailPanel, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/WardDetailPanel.jsx", "client:component-export": "default" })} </section> <!-- Phase 3: Action Center & Citizen Reporting --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"> <section aria-label="Action Center"> ${renderComponent($$result2, "ActionCenter", ActionCenter, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/ActionCenter.jsx", "client:component-export": "default" })} </section> <section aria-label="Citizen Reporting"> ${renderComponent($$result2, "CitizenReport", CitizenReport, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/CitizenReport.jsx", "client:component-export": "default" })} </section> </div> </div> </div> ` })}`;
}, "C:/Users/himan/Desktop/citypulse/frontend/src/pages/index.astro", void 0);

const $$file = "C:/Users/himan/Desktop/citypulse/frontend/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
