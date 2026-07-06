import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { S as createComponent, g as addAttribute, h as renderHead, i as renderComponent, m as maybeRenderHead, s as renderSlot, u as renderTemplate, x as createAstro } from "./server_D0sAaBMA.mjs";
import "./compiler_bqGEvU-1.mjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { create } from "zustand";
import { Activity, AlertCircle, AlertTriangle, BarChart2, BarChart3, Bot, Calendar, Camera, CheckCircle, ChevronDown, ChevronUp, ClipboardList, Clock, Compass, Cpu, Database, Droplets, ExternalLink, Filter, Gauge, HeartPulse, Leaf, Lightbulb, Loader2, Map, MapPin, Mic, MicOff, Send, Shield, ShieldAlert, ShieldCheck, Sparkles, Star, Sun, TestTube, Trash2, TrendingUp, Users, Wind, Zap } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	return renderTemplate`<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="generator"${addAttribute(Astro.generator, "content")}><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"><title>CityPulse — AI Decision Intelligence for Smarter Communities</title><meta name="description" content="AI-powered Decision Intelligence Platform for urban mobility, public safety, environmental sustainability, citizen engagement, and community well-being.">${renderHead($$result)}</head><body><header class="site-header border-b border-[var(--glass-border)] backdrop-blur-xl sticky top-0 z-30 shadow-lg transition-colors" style="background: var(--panel)"><div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-5"><!-- Wordmark --><a href="/" class="flex items-center gap-2 sm:gap-3 shrink-0 rounded-lg transition-transform hover:scale-105 active:scale-95" aria-label="CityPulse Home"><div class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg grid place-items-center font-bold text-base sm:text-lg" style="font-family:var(--font-display); background: var(--amber); color: var(--panel); box-shadow: 0 0 12px rgba(46,168,110,0.12)">C</div><div class="leading-tight"><h1 class="text-base sm:text-lg font-bold tracking-tight" style="color: var(--text)">City<span style="color: var(--amber)">Pulse</span></h1><p class="eyebrow mt-0.5 hidden sm:block">Decision Intelligence Platform</p></div></a><!-- View mode toggle --><div class="flex items-center gap-1 bg-[#0E141E] rounded-lg border border-[#263244] p-0.5 shrink-0" role="radiogroup" aria-label="View mode"><button id="view-planner" class="view-toggle text-xs px-3 py-1.5 rounded-md font-medium transition-colors" data-mode="planner" aria-pressed="true">Planner</button><button id="view-citizen" class="view-toggle text-xs px-3 py-1.5 rounded-md text-[#64748B] hover:text-[#38BDF8] transition-colors" data-mode="citizen" aria-pressed="false">Citizen</button></div><!-- Accessibility toggle --><button id="access-toggle" class="text-xs px-2.5 py-1.5 rounded-md border border-[#263244] text-[#64748B] hover:text-[#38BDF8] bg-[#0E141E] transition-colors hidden sm:flex items-center gap-1.5" aria-label="Toggle accessibility mode"><span aria-hidden="true">Aa</span></button><!-- Live clock / status --><div class="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto" aria-live="polite"><span class="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 shadow-[0_0_10px_rgba(56,189,248,0.15)]"><span class="livedot" aria-hidden="true"></span><span class="eyebrow text-[10px] sm:text-[11px]" style="color:var(--flow)">Live</span></span><time id="dispatch-clock" class="mono text-sm tabular-nums hidden md:block" style="color:var(--text-mid)" aria-label="Current time">--:--:--</time></div></div></header><main class="flex-grow" id="main-content" data-view-mode="planner" data-access-mode="default">${renderSlot($$result, $$slots["default"])}</main><footer class="border-t border-[var(--glass-border)] mt-14 bg-[var(--panel)] backdrop-blur-md"><div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center"><p class="eyebrow">CityPulse · Gen AI Academy APAC</p><p class="eyebrow">Team Infinite Parallax · AI for Better Living and Smarter Communities</p></div></footer><script>
			// Live clock
			const el = document.getElementById('dispatch-clock');
			const tick = () => { if (el) el.textContent = new Date().toLocaleTimeString('en-GB'); };
			tick(); setInterval(tick, 1000);

			// View mode toggle
			const setViewMode = (mode) => {
				document.querySelectorAll('.view-toggle').forEach(btn => {
					const pressed = btn.dataset.mode === mode;
					btn.setAttribute('aria-pressed', pressed);
					if (pressed) {
						btn.style.background = 'rgba(56,189,248,0.15)';
						btn.style.color = '#38BDF8';
					} else {
						btn.style.background = 'transparent';
						btn.style.color = '#64748B';
					}
				});
				document.getElementById('main-content').setAttribute('data-view-mode', mode);
				try {
					import('zustand').then(() => {
						// Dispatch custom event for React components
						window.dispatchEvent(new CustomEvent('viewmodechange', { detail: mode }));
					});
				} catch(e) {}
				// Store in session for persistence
				sessionStorage.setItem('citypulse-view', mode);
			};

			document.getElementById('view-planner').addEventListener('click', () => setViewMode('planner'));
			document.getElementById('view-citizen').addEventListener('click', () => setViewMode('citizen'));

			// Restore saved view
			const saved = sessionStorage.getItem('citypulse-view');
			if (saved) setViewMode(saved);

			// Accessibility mode toggle
			const accToggle = document.getElementById('access-toggle');
			if (accToggle) {
				accToggle.addEventListener('click', () => {
					const main = document.getElementById('main-content');
					const current = main.getAttribute('data-access-mode');
					const next = current === 'high-contrast' ? 'default' : 'high-contrast';
					main.setAttribute('data-access-mode', next);
					document.body.classList.toggle('high-contrast', next === 'high-contrast');
					sessionStorage.setItem('citypulse-access', next);
				});
				const savedAcc = sessionStorage.getItem('citypulse-access');
				if (savedAcc === 'high-contrast') {
					document.getElementById('main-content').setAttribute('data-access-mode', 'high-contrast');
					document.body.classList.add('high-contrast');
				}
			}

			// Lite mode detection
			if ('connection' in navigator && navigator.connection.effectiveType) {
				const ct = navigator.connection.effectiveType;
				if (ct === 'slow-2g' || ct === '2g') {
					document.getElementById('main-content').setAttribute('data-lite-mode', 'true');
				}
			}
		<\/script></body></html>`;
}, "C:/Users/himan/Desktop/citypulse/frontend/src/layouts/Layout.astro", void 0);
//#endregion
//#region src/store/useCityStore.js
var useCityStore = create((set) => ({
	selectedRoute: "",
	setSelectedRoute: (route) => set({ selectedRoute: route }),
	timeRange: "7d",
	setTimeRange: (range) => set({ timeRange: range }),
	queryHistory: [],
	addQuery: (query) => set((state) => ({ queryHistory: [...state.queryHistory, query] })),
	showIncidents: false,
	setShowIncidents: (show) => set({ showIncidents: show }),
	viewMode: "planner",
	setViewMode: (mode) => set({ viewMode: mode }),
	accessibilityMode: "default",
	setAccessibilityMode: (mode) => set({ accessibilityMode: mode }),
	liteMode: false,
	setLiteMode: (lite) => set({ liteMode: lite })
}));
var routes_default = {
	type: "FeatureCollection",
	features: [
		{
			"type": "Feature",
			"properties": { "name": "MG Road" },
			"geometry": {
				"type": "LineString",
				"coordinates": [
					[77.5946, 12.9716],
					[77.6046, 12.9726],
					[77.6146, 12.9736]
				]
			}
		},
		{
			"type": "Feature",
			"properties": { "name": "Ring Road" },
			"geometry": {
				"type": "LineString",
				"coordinates": [
					[77.5846, 12.9616],
					[77.5946, 12.9516],
					[77.6046, 12.9416],
					[77.6146, 12.9516]
				]
			}
		},
		{
			"type": "Feature",
			"properties": { "name": "Airport Expressway" },
			"geometry": {
				"type": "LineString",
				"coordinates": [
					[77.6146, 12.9736],
					[77.6246, 13],
					[77.65, 13.05],
					[77.7, 13.15]
				]
			}
		},
		{
			"type": "Feature",
			"properties": { "name": "Tech Park Avenue" },
			"geometry": {
				"type": "LineString",
				"coordinates": [
					[77.65, 12.92],
					[77.66, 12.93],
					[77.68, 12.95]
				]
			}
		},
		{
			"type": "Feature",
			"properties": { "name": "Station Road" },
			"geometry": {
				"type": "LineString",
				"coordinates": [
					[77.5746, 12.9716],
					[77.5646, 12.9816],
					[77.5546, 12.9716]
				]
			}
		}
	]
};
//#endregion
//#region src/components/Dashboard.jsx
var FLOW = "#38BDF8", CAUTION = "#F97316", STOP = "#FF5A5F", AQI_COLOR = "#8B5CF6";
var scoreColor = (v) => v >= 70 ? STOP : v >= 40 ? CAUTION : FLOW;
var KPI_ICONS = {
	congestion: {
		icon: Gauge,
		label: "Avg Congestion",
		unit: "/100"
	},
	delay: {
		icon: Clock,
		label: "Avg Delay",
		unit: "min"
	},
	peak: {
		icon: Activity,
		label: "Peak Hour",
		unit: ""
	},
	aqi: {
		icon: Wind,
		label: "Avg AQI",
		unit: ""
	}
};
var tooltipStyle = {
	background: "rgba(19, 26, 38, 0.85)",
	backdropFilter: "blur(12px)",
	WebkitBackdropFilter: "blur(12px)",
	border: "1px solid rgba(255, 255, 255, 0.08)",
	boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
	borderRadius: "12px",
	color: "#38BDF8",
	fontSize: 12
};
var Dashboard = () => {
	const [summaryData, setSummaryData] = useState([]);
	const [trafficData, setTrafficData] = useState([]);
	const [forecastData, setForecastData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filterRoute, setFilterRoute] = useState("");
	const selectedRoute = useCityStore((state) => state.selectedRoute);
	const setSelectedRoute = useCityStore((state) => state.setSelectedRoute);
	const routeNames = useMemo(() => {
		if (!routes_default?.features) return [];
		const names = routes_default.features.map((f) => f.properties?.name).filter(Boolean);
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
	const delayChartData = displaySummary.map((s) => ({
		name: s.route_name,
		Delay: s.avg_delay_minutes
	}));
	const sortedTraffic = [...displayTraffic].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
	const trendDataRaw = {};
	sortedTraffic.forEach((t) => {
		const time = new Date(t.timestamp).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		});
		if (!trendDataRaw[time]) trendDataRaw[time] = {
			time,
			congestion: 0,
			count: 0
		};
		trendDataRaw[time].congestion += t.congestion;
		trendDataRaw[time].count += 1;
	});
	const trendData = Object.values(trendDataRaw).map((d) => ({
		time: d.time,
		Congestion: Math.round(d.congestion / d.count)
	})).slice(-24);
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
			extra: /* @__PURE__ */ jsx("div", {
				className: "mt-3 h-1.5 rounded-full bg-[#0E141E] overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "h-full rounded-full transition-all",
					style: {
						width: `${overallAvgCongestion}%`,
						background: congColor
					}
				})
			})
		},
		{
			key: "delay",
			value: overallAvgDelay,
			unit: "min",
			color: "#F97316",
			extra: /* @__PURE__ */ jsx("p", {
				className: "mono text-[11px] text-[#8896A8] mt-3",
				children: "vs. free-flow baseline"
			})
		},
		{
			key: "peak",
			value: peakHour,
			unit: "",
			color: "#38BDF8",
			extra: /* @__PURE__ */ jsx("p", {
				className: "mono text-[11px] text-[#8896A8] mt-3",
				children: "busiest window"
			})
		},
		{
			key: "aqi",
			value: overallAvgAqi,
			unit: "",
			color: AQI_COLOR,
			extra: /* @__PURE__ */ jsx("p", {
				className: "mono text-[11px] text-[#8896A8] mt-3",
				children: "air quality index"
			})
		}
	];
	const handleRouteFilter = (e) => {
		const val = e.target.value;
		setFilterRoute(val);
		setSelectedRoute(val);
	};
	if (loading) return /* @__PURE__ */ jsxs("div", {
		className: "panel h-64 flex flex-col justify-center items-center gap-3",
		"aria-live": "polite",
		children: [/* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-[#FFB020] border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ jsx("span", {
			className: "eyebrow",
			children: "Loading telemetry…"
		})]
	});
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: "panel p-6 flex items-center text-[#FF9497] border-[#FF5A5F]/30",
		"aria-live": "assertive",
		children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-6 h-6 mr-3 flex-shrink-0" }), /* @__PURE__ */ jsx("p", {
			className: "font-semibold",
			children: error
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 route-filter",
				children: [
					/* @__PURE__ */ jsx(Filter, { className: "filter-icon" }),
					/* @__PURE__ */ jsxs("select", {
						"aria-label": "Filter by route",
						value: activeRoute,
						onChange: handleRouteFilter,
						className: "route-select",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "All routes"
						}), routeNames.map((name) => /* @__PURE__ */ jsx("option", {
							value: name,
							children: name
						}, name))]
					}),
					activeRoute && /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							setFilterRoute("");
							setSelectedRoute("");
						},
						className: "text-xs clear-filter hover:text-[#38BDF8] transition-colors px-2 py-1",
						children: "Clear filter"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: kpiCards.map(({ key, value, unit, color, extra }) => {
					const meta = KPI_ICONS[key];
					const Icon = meta.icon;
					return /* @__PURE__ */ jsxs("div", {
						className: "panel p-4 sm:p-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "eyebrow",
									children: meta.label
								}), /* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-lg grid place-items-center border",
									style: {
										background: `${color}1a`,
										borderColor: `${color}44`,
										color
									},
									children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-baseline gap-1.5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "stat text-2xl sm:text-4xl",
									style: { color: key === "congestion" ? color : "#38BDF8" },
									children: value
								}), unit && /* @__PURE__ */ jsx("span", {
									className: "text-[#8896A8] text-sm",
									children: unit
								})]
							}),
							extra
						]
					}, key);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "panel",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-semibold text-[#38BDF8]",
							children: "Congestion Trend · 24h"
						}), /* @__PURE__ */ jsx("span", {
							className: "eyebrow",
							children: activeRoute || "All corridors"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "p-4 h-64",
						children: /* @__PURE__ */ jsx(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ jsxs(AreaChart, {
								data: trendData,
								margin: {
									top: 8,
									right: 8,
									left: -12,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", {
										id: "congFill",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ jsx("stop", {
											offset: "0%",
											stopColor: FLOW,
											stopOpacity: .35
										}), /* @__PURE__ */ jsx("stop", {
											offset: "100%",
											stopColor: FLOW,
											stopOpacity: 0
										})]
									}) }),
									/* @__PURE__ */ jsx(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										stroke: "#1B2534"
									}),
									/* @__PURE__ */ jsx(XAxis, {
										dataKey: "time",
										stroke: "#8896A8",
										fontSize: 12,
										tickMargin: 8,
										minTickGap: 30,
										tickLine: false,
										axisLine: { stroke: "#1B2534" }
									}),
									/* @__PURE__ */ jsx(YAxis, {
										stroke: "#8896A8",
										fontSize: 12,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ jsx(Tooltip, {
										cursor: { stroke: "#263244" },
										contentStyle: tooltipStyle
									}),
									/* @__PURE__ */ jsx(Area, {
										type: "monotone",
										dataKey: "Congestion",
										stroke: FLOW,
										strokeWidth: 2.5,
										fill: "url(#congFill)",
										dot: false,
										activeDot: {
											r: 5,
											fill: FLOW,
											stroke: "#0B0E14",
											strokeWidth: 2
										}
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "panel",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-semibold text-[#38BDF8]",
							children: "Avg Delay by Route"
						}), /* @__PURE__ */ jsx("span", {
							className: "eyebrow",
							children: "minutes"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "p-4 h-64",
						children: /* @__PURE__ */ jsx(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ jsxs(BarChart, {
								data: delayChartData,
								margin: {
									top: 8,
									right: 8,
									left: -12,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ jsx(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										stroke: "#1B2534"
									}),
									/* @__PURE__ */ jsx(XAxis, {
										dataKey: "name",
										stroke: "#8896A8",
										fontSize: 12,
										tickMargin: 8,
										tickLine: false,
										axisLine: { stroke: "#1B2534" }
									}),
									/* @__PURE__ */ jsx(YAxis, {
										stroke: "#8896A8",
										fontSize: 12,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ jsx(Tooltip, {
										cursor: { fill: "rgba(255,255,255,0.04)" },
										contentStyle: tooltipStyle
									}),
									/* @__PURE__ */ jsx(Bar, {
										dataKey: "Delay",
										fill: CAUTION,
										radius: [
											4,
											4,
											0,
											0
										],
										maxBarSize: 44
									})
								]
							})
						})
					})]
				})]
			}),
			activeForecast && /* @__PURE__ */ jsxs("div", {
				className: "panel",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-[#38BDF8]" }), /* @__PURE__ */ jsxs("h3", {
								className: "text-base font-semibold text-[#38BDF8]",
								children: [
									"Congestion Forecast · next ",
									activeForecast.horizon_hours,
									"h"
								]
							})]
						}), /* @__PURE__ */ jsxs("span", {
							className: "eyebrow",
							children: [activeForecast.route_name, " · 90% band"]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "p-4 h-72",
						children: /* @__PURE__ */ jsx(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ jsxs(ComposedChart, {
								data: forecastChartData,
								margin: {
									top: 8,
									right: 12,
									left: -12,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", {
										id: "bandFill",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ jsx("stop", {
											offset: "0%",
											stopColor: "#38BDF8",
											stopOpacity: .28
										}), /* @__PURE__ */ jsx("stop", {
											offset: "100%",
											stopColor: "#38BDF8",
											stopOpacity: .06
										})]
									}) }),
									/* @__PURE__ */ jsx(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										stroke: "#1B2534"
									}),
									/* @__PURE__ */ jsx(XAxis, {
										dataKey: "ts",
										tickFormatter: fmtHour,
										stroke: "#8896A8",
										fontSize: 11,
										tickMargin: 8,
										minTickGap: 28,
										tickLine: false,
										axisLine: { stroke: "#1B2534" }
									}),
									/* @__PURE__ */ jsx(YAxis, {
										domain: [0, 100],
										stroke: "#8896A8",
										fontSize: 12,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ jsx(Tooltip, {
										cursor: { stroke: "#263244" },
										contentStyle: tooltipStyle,
										labelFormatter: (ts) => {
											const p = forecastChartData.find((d) => d.ts === ts);
											return p ? p.label : ts;
										},
										formatter: (value, name) => {
											if (name === "Uncertainty band" && Array.isArray(value)) return [`${value[0]}–${value[1]}`, name];
											return [value, name];
										}
									}),
									/* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: 12 } }),
									/* @__PURE__ */ jsx(Area, {
										type: "monotone",
										dataKey: "range",
										name: "Uncertainty band",
										stroke: "none",
										fill: "url(#bandFill)",
										connectNulls: false,
										isAnimationActive: false
									}),
									/* @__PURE__ */ jsx(Line, {
										type: "monotone",
										dataKey: "Actual",
										name: "Actual",
										stroke: "#8896A8",
										strokeWidth: 2,
										dot: false,
										connectNulls: false,
										isAnimationActive: false
									}),
									/* @__PURE__ */ jsx(Line, {
										type: "monotone",
										dataKey: "Forecast",
										name: "Forecast",
										stroke: "#38BDF8",
										strokeWidth: 2.5,
										strokeDasharray: "5 4",
										dot: false,
										connectNulls: true,
										isAnimationActive: false
									}),
									boundaryTs && /* @__PURE__ */ jsx(ReferenceLine, {
										x: boundaryTs,
										stroke: "#FFB020",
										strokeDasharray: "2 4",
										label: {
											value: "now",
											position: "top",
											fill: "#FFB020",
											fontSize: 10
										}
									})
								]
							})
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "px-4 pb-4 -mt-1",
						children: /* @__PURE__ */ jsxs("p", {
							className: "mono text-[11px] text-[#64748B]",
							children: [
								activeForecast.method,
								activeForecast.params?.alpha != null && /* @__PURE__ */ jsxs(Fragment$1, { children: [
									" · α=",
									activeForecast.params.alpha,
									" β=",
									activeForecast.params.beta,
									activeForecast.params.gamma != null && /* @__PURE__ */ jsxs(Fragment$1, { children: [" γ=", activeForecast.params.gamma] })
								] }),
								" · σ=",
								activeForecast.residual_std
							]
						})
					})
				]
			})
		]
	});
};
//#endregion
//#region src/components/ExplainabilityPanel.jsx
var LABEL_COLOR = {
	high: "#38BDF8",
	medium: "#FFB020",
	low: "#8896A8"
};
var SourceRow = ({ source }) => {
	if (source && typeof source === "object" && "similarity" in source) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between gap-2 bg-[#0E141E] px-3 py-2 rounded-lg border border-[#1B2534]",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-xs text-[#38BDF8] font-medium truncate",
			children: source.route_name || source.ward || source.key || "source"
		}), /* @__PURE__ */ jsxs("span", {
			className: "mono text-[11px] text-[#38BDF8] flex-shrink-0",
			children: ["sim ", Number(source.similarity).toFixed(3)]
		})]
	});
	return /* @__PURE__ */ jsx("pre", {
		className: "text-[11px] font-mono bg-[#0E141E] p-2.5 rounded-lg overflow-x-auto text-[#9AA9BD] border border-[#1B2534] custom-scrollbar",
		children: JSON.stringify(source, null, 2)
	});
};
var ExplainabilityPanel = ({ explain, title = "Why this answer?", defaultOpen = false }) => {
	const [open, setOpen] = useState(defaultOpen);
	if (!explain) return null;
	const { confidence = 0, confidence_label = "low", rationale, sources = [], method } = explain;
	const color = LABEL_COLOR[confidence_label] || "#8896A8";
	const pct = Math.round(Math.max(0, Math.min(1, confidence)) * 100);
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-4 border border-[#263244] rounded-xl overflow-hidden",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			"aria-expanded": open,
			className: "w-full px-4 py-3 bg-[#0E141E] flex items-center justify-between gap-3 text-sm font-medium text-[#9AA9BD] hover:bg-[#182233] transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFB020]",
			onClick: () => setOpen(!open),
			children: [/* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-[#FFB020]" }), title]
			}), /* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider",
					style: {
						background: `${color}1f`,
						color
					},
					children: [
						confidence_label,
						" · ",
						pct,
						"%"
					]
				}), open ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" })]
			})]
		}), open && /* @__PURE__ */ jsxs("div", {
			className: "p-4 bg-[#131A26] border-t border-[#263244] space-y-4",
			children: [
				rationale && /* @__PURE__ */ jsx("p", {
					className: "text-sm text-[#38BDF8] leading-relaxed",
					children: rationale
				}),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 mb-1.5",
					children: [/* @__PURE__ */ jsx(Gauge, { className: "w-3.5 h-3.5 text-[#8896A8]" }), /* @__PURE__ */ jsx("span", {
						className: "eyebrow",
						children: "Confidence / relevance"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "h-1.5 rounded-full bg-[#0E141E] overflow-hidden",
					children: /* @__PURE__ */ jsx("div", {
						className: "h-full rounded-full transition-all",
						style: {
							width: `${pct}%`,
							background: color
						}
					})
				})] }),
				sources && sources.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 mb-2",
					children: [/* @__PURE__ */ jsx(Database, { className: "w-3.5 h-3.5 text-[#8896A8]" }), /* @__PURE__ */ jsxs("span", {
						className: "eyebrow",
						children: [
							"Sources used (",
							sources.length,
							")"
						]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-2 max-h-56 overflow-y-auto custom-scrollbar",
					children: sources.map((s, i) => /* @__PURE__ */ jsx(SourceRow, { source: s }, i))
				})] }),
				method && /* @__PURE__ */ jsxs("p", {
					className: "mono text-[11px] text-[#64748B]",
					children: ["Method: ", method]
				})
			]
		})]
	});
};
//#endregion
//#region src/components/QueryBar.jsx
var VOICE_SUPPORTED = typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
var CANNED_EXAMPLES = [
	"Which ward has the most incidents and worst AQI?",
	"Is there a correlation between traffic congestion and air quality today?",
	"Plan my ideal commute: lowest AQI and least congestion",
	"Simulate AQI impact if waste collection improves by 20% across all wards",
	"Which areas need priority disaster preparedness resources?",
	"Rank wards by tourism potential and safety"
];
var QueryBar = () => {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [response, setResponse] = useState(null);
	const [listening, setListening] = useState(false);
	const recognitionRef = useRef(null);
	const addQueryToHistory = useCityStore((state) => state.addQuery);
	const viewMode = useCityStore((state) => state.viewMode);
	const startListening = useCallback(() => {
		if (!VOICE_SUPPORTED) return;
		const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
		recognition.lang = "en-US";
		recognition.continuous = false;
		recognition.interimResults = false;
		recognition.onresult = (event) => {
			const transcript = event.results[0][0].transcript;
			setQuery(transcript);
			setListening(false);
		};
		recognition.onerror = () => setListening(false);
		recognition.onend = () => setListening(false);
		recognitionRef.current = recognition;
		recognition.start();
		setListening(true);
	}, []);
	const stopListening = useCallback(() => {
		if (recognitionRef.current) {
			recognitionRef.current.stop();
			setListening(false);
		}
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!query.trim()) return;
		setLoading(true);
		setError(null);
		setResponse(null);
		try {
			const res = await fetch(`/api/query`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ question: query })
			});
			if (!res.ok) throw new Error("Failed to fetch AI response");
			const data = await res.json();
			setResponse(data);
			addQueryToHistory({
				question: query,
				...data
			});
		} catch (err) {
			console.error(err);
			setError("Sorry, we couldn't connect to the AI service. Please try again later.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "panel p-5 mb-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 mb-3",
				children: [
					/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-[#FFB020]" }),
					/* @__PURE__ */ jsx("span", {
						className: "eyebrow",
						children: viewMode === "citizen" ? "Ask your city anything" : "Ask the city"
					}),
					VOICE_SUPPORTED && /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: listening ? stopListening : startListening,
						className: `ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${listening ? "bg-[#FF5A5F]/20 text-[#FF5A5F] border-[#FF5A5F]/50 animate-pulse" : "bg-[#1B2534] text-[#8896A8] border-[#263244] hover:text-[#38BDF8]"}`,
						"aria-label": listening ? "Stop listening" : "Voice input",
						children: [listening ? /* @__PURE__ */ jsx(MicOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Mic, { className: "w-3.5 h-3.5" }), listening ? "Listening..." : "Voice"]
					})
				]
			}),
			/* @__PURE__ */ jsx("form", {
				onSubmit: handleSubmit,
				className: "relative",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center bg-[#E8F9EE] border border-[#6EE3A0] rounded-xl overflow-hidden focus-within:border-[#6EE3A0] transition-colors",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "pl-4 text-[#4EBF79]",
							children: /* @__PURE__ */ jsx(Bot, { className: "w-6 h-6" })
						}),
						/* @__PURE__ */ jsx("input", {
							id: "query-input",
							name: "query",
							type: "text",
							autoComplete: "off",
							"aria-label": "Ask the city",
							className: "flex-1 bg-transparent border-none py-4 px-4 text-[#11502B] placeholder-[#6A8B6F] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
							placeholder: viewMode === "citizen" ? "e.g. Is it safe to travel on MG Road?…" : "e.g. Which corridor has the worst congestion right now?…",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							disabled: loading
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: !query.trim() || loading,
							className: "btn-signal px-6 py-4 flex items-center gap-2 active:scale-95 transition-transform",
							children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }), " Ask"] })
						})
					]
				})
			}),
			viewMode === "planner" && /* @__PURE__ */ jsx("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: CANNED_EXAMPLES.map((example) => /* @__PURE__ */ jsx("button", {
					onClick: () => setQuery(example),
					className: "text-xs px-3 py-1.5 rounded-full bg-[#1B2534] text-[#8896A8] hover:bg-[#263244] hover:text-[#38BDF8] transition-colors border border-[#263244]",
					children: example
				}, example))
			}),
			error && /* @__PURE__ */ jsxs("div", {
				className: "mt-4 bg-[#FF5A5F]/10 text-[#FF9497] p-4 rounded-xl border border-[#FF5A5F]/30 flex items-start",
				"aria-live": "assertive",
				children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 mr-3 mt-0.5 flex-shrink-0" }), /* @__PURE__ */ jsx("p", { children: error })]
			}),
			response && /* @__PURE__ */ jsxs("div", {
				className: "mt-6 border-t border-[var(--glass-border)] pt-6",
				"aria-live": "polite",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-start mb-6",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 rounded-lg bg-[#38BDF8]/12 flex items-center justify-center text-[#38BDF8] mr-4 flex-shrink-0 border border-[#38BDF8]/25",
							children: /* @__PURE__ */ jsx(Bot, { className: "w-6 h-6" })
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "eyebrow mb-1.5",
								children: "CityPulse AI"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[#38BDF8] text-lg leading-relaxed",
								children: response.answer
							})]
						})]
					}),
					response.chart_data && response.chart_data.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "mt-6 mb-6 bg-[#0E141E] p-4 rounded-xl border border-[#1B2534] h-80 flex flex-col",
						children: [/* @__PURE__ */ jsxs("h5", {
							className: "eyebrow mb-4 flex items-center flex-shrink-0",
							children: [/* @__PURE__ */ jsx(BarChart2, { className: "w-3.5 h-3.5 mr-2" }), " Data Visualization"]
						}), /* @__PURE__ */ jsx("div", {
							className: "flex-1 min-h-0 w-full",
							children: /* @__PURE__ */ jsx(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ jsxs(BarChart, {
									data: response.chart_data,
									children: [
										/* @__PURE__ */ jsx(XAxis, {
											dataKey: "label",
											stroke: "#64748B",
											fontSize: 12
										}),
										/* @__PURE__ */ jsx(YAxis, {
											stroke: "#64748B",
											fontSize: 12
										}),
										/* @__PURE__ */ jsx(Tooltip, {
											cursor: { fill: "rgba(255,255,255,0.04)" },
											contentStyle: {
												background: "#131A26",
												border: "1px solid #263244",
												borderRadius: "10px",
												color: "#38BDF8"
											}
										}),
										/* @__PURE__ */ jsx(Bar, {
											dataKey: "value",
											fill: "#FFB020",
											radius: [
												4,
												4,
												0,
												0
											]
										})
									]
								})
							})
						})]
					}),
					response.explain && /* @__PURE__ */ jsx(ExplainabilityPanel, {
						explain: response.explain,
						title: "Why this answer?"
					})
				]
			})
		]
	});
};
//#endregion
//#region src/components/AlertsPanel.jsx
var AlertsPanel = () => {
	const [alerts, setAlerts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const fetchAlerts = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/alerts`);
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
	if (loading) return /* @__PURE__ */ jsxs("div", {
		className: "panel h-64 flex flex-col justify-center items-center gap-3",
		"aria-live": "polite",
		children: [/* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-[#FF5A5F] border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ jsx("span", {
			className: "eyebrow",
			children: "Scanning for anomalies…"
		})]
	});
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: "panel p-5 flex items-center text-[#FF9497] border-[#FF5A5F]/30",
		"aria-live": "assertive",
		children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 mr-3 flex-shrink-0" }), /* @__PURE__ */ jsx("p", {
			className: "font-semibold text-sm",
			children: error
		})]
	});
	if (alerts.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "panel h-64 flex flex-col justify-center items-center text-center px-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "w-12 h-12 rounded-full grid place-items-center mb-3 border border-[#38BDF8]/30 bg-[#38BDF8]/12 text-[#38BDF8]",
				children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-6 h-6" })
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "font-semibold text-[#38BDF8]",
				children: "All Clear"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-[#64748B] mt-1",
				children: "No anomalies in the network."
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-head",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-[#FF5A5F]" }), /* @__PURE__ */ jsx("h3", {
					className: "text-base font-semibold text-[#38BDF8]",
					children: "Active Anomalies"
				})]
			}), /* @__PURE__ */ jsx("span", {
				className: "mono text-xs px-2 py-0.5 rounded-full bg-[#FF5A5F]/12 text-[#FF9497] border border-[#FF5A5F]/25",
				children: alerts.length
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "p-4 space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar",
			children: alerts.map((alert) => {
				const accent = alert.severity === "CRITICAL" ? "#FF5A5F" : "#FFB020";
				return /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl bg-[#0E141E] border border-[#1B2534] p-4 hover:border-[#FF5A5F]/50 transition-all hover:-translate-y-0.5 shadow-lg",
					style: { borderLeft: `3px solid ${accent}` },
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between items-center mb-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider",
								style: {
									background: `${accent}1f`,
									color: accent
								},
								children: alert.severity
							}), /* @__PURE__ */ jsxs("span", {
								className: "flex items-center mono text-[11px] text-[#64748B]",
								children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 mr-1" }), new Date(alert.timestamp).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("h4", {
							className: "font-semibold text-[#38BDF8] mb-1 flex items-center text-sm",
							children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 mr-1.5 text-[#64748B]" }), alert.route_name]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-[#9AA9BD] mb-3 leading-relaxed",
							children: alert.message
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 mono text-[11px]",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]",
								children: [
									"Congestion ",
									/* @__PURE__ */ jsx("span", {
										className: "text-[#38BDF8]",
										children: alert.metrics.congestion
									}),
									"/100"
								]
							}), /* @__PURE__ */ jsxs("span", {
								className: "px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]",
								children: [
									"Delay ",
									/* @__PURE__ */ jsx("span", {
										className: "text-[#38BDF8]",
										children: alert.metrics.delay
									}),
									"m"
								]
							})]
						}),
						alert.explain && /* @__PURE__ */ jsx(ExplainabilityPanel, {
							explain: alert.explain,
							title: "Why flagged?"
						})
					]
				}, alert.id);
			})
		})]
	});
};
//#endregion
//#region src/components/RecommendationCard.jsx
var RecommendationCard = () => {
	const [recommendations, setRecommendations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/recommendations`);
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
	if (loading) return /* @__PURE__ */ jsxs("div", {
		className: "panel h-64 flex flex-col justify-center items-center",
		"aria-live": "polite",
		children: [/* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-[#38BDF8] border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ jsx("p", {
			className: "mt-3 text-sm font-medium text-[#9AA9BD]",
			children: "Generating AI Recommendations…"
		})]
	});
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: "panel p-5 flex items-center text-[#FF9497] border border-[#FF5A5F]/30",
		"aria-live": "assertive",
		children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 mr-3 flex-shrink-0" }), /* @__PURE__ */ jsx("p", {
			className: "font-semibold text-sm",
			children: error
		})]
	});
	if (recommendations.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "panel h-64 flex flex-col justify-center items-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "w-12 h-12 bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 rounded-full flex items-center justify-center mb-3 shadow-[0_0_12px_rgba(56,189,248,0.15)]",
				children: /* @__PURE__ */ jsx(Lightbulb, { className: "w-6 h-6" })
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "font-semibold text-[#38BDF8]",
				children: "No Action Needed"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-[#9AA9BD] mt-1",
				children: "Traffic patterns are within normal parameters."
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "panel h-full flex flex-col",
		children: [/* @__PURE__ */ jsx("div", {
			className: "panel-head",
			children: /* @__PURE__ */ jsxs("h3", {
				className: "text-base font-bold flex items-center",
				style: { color: "var(--amber)" },
				children: [
					/* @__PURE__ */ jsx(Sparkles, {
						className: "w-4 h-4 mr-2",
						style: { color: "var(--amber)" }
					}),
					"AI Recommendations (",
					recommendations.length,
					")"
				]
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "p-4 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar flex-grow",
			children: recommendations.map((rec) => /* @__PURE__ */ jsx("div", {
				className: "border border-[#1B2534] rounded-xl overflow-hidden bg-[#0E141E] hover:border-[#FFB020]/50 transition-all hover:-translate-y-0.5 shadow-lg",
				children: /* @__PURE__ */ jsxs("div", {
					className: "p-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between items-start mb-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "mono text-[10px] font-bold px-2 py-1 rounded tracking-wider bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 uppercase",
								children: rec.route_name
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-medium text-[#9AA9BD] px-2 py-1 bg-[#131A26] border border-[#263244] rounded",
								children: rec.issue
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex items-start",
							children: [/* @__PURE__ */ jsx(Lightbulb, { className: "w-4 h-4 text-[#FFB020] mr-2 flex-shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("p", {
								className: "text-[#38BDF8] text-sm font-medium leading-relaxed",
								children: rec.suggestion
							})]
						}),
						rec.explain && /* @__PURE__ */ jsx(ExplainabilityPanel, {
							explain: rec.explain,
							title: "Why this recommendation?"
						})
					]
				})
			}, rec.id))
		})]
	});
};
//#endregion
//#region src/components/HealthAdvisory.jsx
var riskColor = (level) => ({
	LOW: "#38BDF8",
	MODERATE: "#FFB020",
	ELEVATED: "#FF9F1C",
	HIGH: "#FF5A5F",
	SEVERE: "#FF3B5C"
})[level] || "#9AA9BD";
var HealthAdvisory = () => {
	const [advisories, setAdvisories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const fetchAdvisories = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/advisories`);
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
	if (loading) return /* @__PURE__ */ jsxs("div", {
		className: "panel h-64 flex flex-col justify-center items-center gap-3",
		"aria-live": "polite",
		children: [/* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ jsx("span", {
			className: "eyebrow",
			children: "Cross-referencing AQI & congestion…"
		})]
	});
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: "panel p-5 flex items-center text-[#FF9497] border-[#FF5A5F]/30",
		"aria-live": "assertive",
		children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 mr-3 flex-shrink-0" }), /* @__PURE__ */ jsx("p", {
			className: "font-semibold text-sm",
			children: error
		})]
	});
	const actionable = advisories.filter((a) => a.risk_level !== "LOW");
	return /* @__PURE__ */ jsxs("div", {
		className: "panel h-full flex flex-col",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-head",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(HeartPulse, { className: "w-4 h-4 text-[#8B5CF6]" }), /* @__PURE__ */ jsx("h3", {
					className: "text-base font-semibold text-[#38BDF8]",
					children: "Health & Air-Quality Advisories"
				})]
			}), /* @__PURE__ */ jsxs("span", {
				className: "mono text-xs px-2 py-0.5 rounded-full bg-[#8B5CF6]/12 text-[#C4B5FD] border border-[#8B5CF6]/25",
				children: [actionable.length, " active"]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-4 space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar flex-grow",
			children: [advisories.length === 0 && /* @__PURE__ */ jsxs("div", {
				className: "h-40 flex flex-col justify-center items-center text-center",
				children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-8 h-8 text-[#38BDF8] mb-2" }), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-[#9AA9BD]",
					children: "No air-quality data available."
				})]
			}), advisories.map((a) => {
				const accent = riskColor(a.risk_level);
				return /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl bg-[#0E141E] border border-[#1B2534] p-4 shadow-lg",
					style: { borderLeft: `3px solid ${accent}` },
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between items-center mb-2",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "font-semibold text-[#38BDF8] text-sm",
								children: a.route_name
							}), /* @__PURE__ */ jsx("span", {
								className: "mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider",
								style: {
									background: `${accent}1f`,
									color: accent
								},
								children: a.risk_level
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 mb-3 mono text-[11px]",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD] flex items-center gap-1",
									children: [
										/* @__PURE__ */ jsx(Wind, { className: "w-3 h-3" }),
										" AQI ",
										/* @__PURE__ */ jsx("span", {
											className: "text-[#38BDF8]",
											children: a.peak_aqi
										})
									]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]",
									children: a.aqi_category
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "px-2 py-1 rounded bg-[#131A26] border border-[#263244] text-[#9AA9BD]",
									children: [
										"Cong ",
										/* @__PURE__ */ jsx("span", {
											className: "text-[#38BDF8]",
											children: a.peak_congestion
										}),
										"/100"
									]
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-[#9AA9BD] leading-relaxed mb-3",
							children: a.advisory
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-1.5 text-[11px] text-[#64748B]",
							children: [/* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5 mt-0.5 flex-shrink-0" }), /* @__PURE__ */ jsx("span", { children: a.vulnerable_groups.join(" · ") })]
						})
					]
				}, a.id);
			})]
		})]
	});
};
//#endregion
//#region src/components/WardDetailPanel.jsx
var WardDetailPanel = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const fetchLivability = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/environment/livability`);
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
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "panel p-6 flex items-center justify-center h-48",
		children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" })
	});
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: "panel p-6 text-[#FF9497] flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5" }), error]
	});
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-4",
		children: data.map((ward) => /* @__PURE__ */ jsxs("div", {
			className: "panel p-5 space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-bold text-lg text-[#38BDF8]",
						children: ward.ward
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "eyebrow text-[#38BDF8]",
							children: "Livability Score"
						}), /* @__PURE__ */ jsxs("span", {
							className: `px-2 py-1 rounded text-sm font-bold ${ward.livability_score >= 80 ? "bg-[#10b981]/20 text-[#10b981]" : ward.livability_score >= 60 ? "bg-[#f97316]/20 text-[#f97316]" : "bg-[#ef4444]/20 text-[#ef4444]"}`,
							children: [ward.livability_score, "/100"]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 text-[#8896A8] text-xs uppercase tracking-wider",
								children: [/* @__PURE__ */ jsx(Leaf, { className: "w-3.5 h-3.5" }), "AQI"]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xl font-semibold text-[#38BDF8]",
								children: ward.aqi
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 text-[#8896A8] text-xs uppercase tracking-wider",
								children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }), "Waste Eff."]
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-xl font-semibold text-[#38BDF8]",
								children: [ward.waste_efficiency, "%"]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 text-[#8896A8] text-xs uppercase tracking-wider",
								children: [/* @__PURE__ */ jsx(ShieldAlert, { className: "w-3.5 h-3.5" }), "Incidents"]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xl font-semibold text-[#38BDF8]",
								children: ward.incident_rate
							})]
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "pt-3 border-t border-[#263244]",
					children: /* @__PURE__ */ jsxs("p", {
						className: "text-sm text-[#8896A8] italic",
						children: [
							"\" ",
							ward.interpretation,
							" \""
						]
					})
				})
			]
		}, ward.ward))
	});
};
//#endregion
//#region src/components/ActionCenter.jsx
var ActionCenter = () => {
	const [memos, setMemos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		fetchMemos();
	}, []);
	const fetchMemos = async () => {
		try {
			setLoading(true);
			const res = await fetch(`/api/actions/memos`);
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
			if ((await fetch(`/api/actions/dispatch/${id}`, { method: "POST" })).ok) fetchMemos();
		} catch (err) {
			console.error("Failed to dispatch memo:", err);
		}
	};
	const handleTestDraft = async () => {
		try {
			if ((await fetch(`/api/actions/draft`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "TEST_ANOMALY",
					details: "High congestion on Main St."
				})
			})).ok) fetchMemos();
		} catch (err) {
			console.error("Failed to draft memo:", err);
		}
	};
	if (loading && memos.length === 0) return /* @__PURE__ */ jsx("div", {
		className: "panel p-6 flex items-center justify-center h-48",
		children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" })
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-center mb-4",
				children: [/* @__PURE__ */ jsxs("h3", {
					className: "text-lg font-bold text-[#38BDF8] flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(ClipboardList, { className: "w-5 h-5 text-[#FFB020]" }), " Action Center"]
				}), /* @__PURE__ */ jsx("button", {
					onClick: handleTestDraft,
					className: "text-xs px-3 py-1.5 rounded bg-[#1B2534] border border-[#263244] text-[#38BDF8] hover:bg-[#263244] transition-colors",
					children: "+ Draft Test Memo"
				})]
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "text-[#FF9497] text-sm",
				children: error
			}),
			memos.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-[#8896A8] italic",
				children: "No action memos generated yet."
			}) : memos.map((memo) => /* @__PURE__ */ jsxs("div", {
				className: "panel p-5 border border-[#263244] hover:border-[#38BDF8]/30 transition-colors",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between items-start mb-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
							className: "font-semibold text-[#38BDF8]",
							children: memo.title
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-xs text-[#8896A8] mt-1 flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(AlertTriangle, { className: "w-3 h-3" }),
								" Dept: ",
								memo.department
							]
						})] }), /* @__PURE__ */ jsx("span", {
							className: `text-xs px-2 py-1 rounded font-bold ${memo.status === "DISPATCHED" ? "bg-[#10b981]/20 text-[#10b981]" : "bg-[#f97316]/20 text-[#f97316]"}`,
							children: memo.status
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-[#38BDF8] mb-3",
						children: memo.justification
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-[#0B0E14] p-3 rounded text-sm mb-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "eyebrow block mb-2 text-[#8896A8]",
							children: "Action Items:"
						}), /* @__PURE__ */ jsx("ul", {
							className: "list-disc pl-4 text-[#38BDF8] space-y-1",
							children: memo.action_items?.map((item, idx) => /* @__PURE__ */ jsx("li", { children: item }, idx))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between items-center pt-3 border-t border-[#263244]",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-xs text-[#64748B] flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }), new Date(memo.created_at).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							})]
						}), memo.status === "DRAFT" && /* @__PURE__ */ jsxs("button", {
							onClick: () => handleDispatch(memo.id),
							className: "flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-[#38BDF8] text-[#0B0E14] rounded hover:bg-[#38BDF8]/90 transition-colors",
							children: [/* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }), " Approve & Dispatch"]
						})]
					})
				]
			}, memo.id))
		]
	});
};
//#endregion
//#region src/components/CitizenReport.jsx
var CitizenReport = () => {
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
			if (!(await fetch(`/api/citizen/report`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text,
					photoBase64,
					ward: "Gomti Nagar",
					lat: 12.975,
					lng: 77.61
				})
			})).ok) throw new Error("Failed to submit report");
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
	return /* @__PURE__ */ jsxs("div", {
		className: "panel p-5",
		children: [/* @__PURE__ */ jsxs("h3", {
			className: "text-lg font-bold text-[#38BDF8] mb-4 flex items-center gap-2",
			children: [/* @__PURE__ */ jsx("span", { className: "w-1 h-5 rounded-full bg-[#3b82f6]" }), "Citizen Report"]
		}), success ? /* @__PURE__ */ jsxs("div", {
			className: "bg-[#10b981]/10 text-[#10b981] p-4 rounded-lg flex items-center gap-3 border border-[#10b981]/20",
			children: [/* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5" }), /* @__PURE__ */ jsx("p", {
				className: "font-semibold text-sm",
				children: "Report submitted successfully!"
			})]
		}) : /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("textarea", {
					className: "w-full bg-[#0E141E] border border-[#263244] rounded-lg p-3 text-sm text-[#38BDF8] placeholder-[#64748B] focus:border-[#3b82f6] focus:outline-none transition-colors min-h-[100px] resize-none",
					placeholder: "Describe the issue (e.g., severe pothole on Main St, uncollected garbage...)",
					value: text,
					onChange: (e) => setText(e.target.value)
				}) }),
				error && /* @__PURE__ */ jsx("p", {
					className: "text-[#FF9497] text-xs",
					children: error
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2 cursor-pointer text-sm text-[#8896A8] hover:text-[#38BDF8] transition-colors",
						children: [
							/* @__PURE__ */ jsx(Camera, { className: "w-4 h-4" }),
							/* @__PURE__ */ jsx("span", { children: photoBase64 ? "Photo Attached" : "Attach Photo" }),
							/* @__PURE__ */ jsx("input", {
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: handlePhotoUpload
							})
						]
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: loading || !text && !photoBase64,
						className: "btn-signal bg-[#3b82f6]/20 text-[#3b82f6] hover:bg-[#3b82f6]/30 px-4 py-2 flex items-center gap-2 border border-[#3b82f6]/30 disabled:opacity-50",
						children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }), " Submit"] })
					})]
				})
			]
		})]
	});
};
//#endregion
//#region src/components/TourismPanel.jsx
var CATEGORY_ICONS = {
	shopping: "🛍️",
	dining: "🍽️",
	park: "🌳",
	wellness: "🧘",
	culture: "🎭",
	business: "💼",
	food: "🍴"
};
var TourismPanel = () => {
	const [pois, setPois] = useState([]);
	const [events, setEvents] = useState([]);
	const [impact, setImpact] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filter, setFilter] = useState("");
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const API = "";
				const [poiRes, eventRes, impactRes] = await Promise.all([
					fetch(`${API}/api/tourism/poi`),
					fetch(`${API}/api/tourism/events`),
					fetch(`${API}/api/tourism/impact`)
				]);
				if (!poiRes.ok) throw new Error("Failed to load tourism data");
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
	const categories = [...new Set(pois.map((p) => p.category))];
	const filtered = filter ? pois.filter((p) => p.category === filter) : pois;
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "panel h-48 flex items-center justify-center",
		children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" })
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			impact && /* @__PURE__ */ jsxs("div", {
				className: "panel p-5 border-l-4",
				style: { borderLeftColor: "#10B981" },
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 mb-2",
						children: [/* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-[#10B981]" }), /* @__PURE__ */ jsx("span", {
							className: "eyebrow",
							children: "Local Economy Impact"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-[#38BDF8] leading-relaxed",
						children: impact.interpretation
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-4 mt-3 text-xs text-[#8896A8]",
						children: [
							/* @__PURE__ */ jsxs("span", { children: [impact.total_footfall.toLocaleString(), " daily footfall"] }),
							/* @__PURE__ */ jsxs("span", { children: [
								"Avg rating: ",
								impact.avg_rating,
								"/5"
							] }),
							/* @__PURE__ */ jsxs("span", { children: [impact.upcoming_events, " upcoming events"] })
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-[#FFB020]" }),
					/* @__PURE__ */ jsxs("span", {
						className: "eyebrow",
						children: [
							"Points of Interest (",
							filtered.length,
							")"
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ml-auto flex gap-1",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => setFilter(""),
							className: `text-xs px-2 py-1 rounded ${!filter ? "bg-[#38BDF8]/20 text-[#38BDF8]" : "text-[#64748B] hover:text-[#38BDF8]"}`,
							children: "All"
						}), categories.map((cat) => /* @__PURE__ */ jsxs("button", {
							onClick: () => setFilter(cat),
							className: `text-xs px-2 py-1 rounded capitalize ${filter === cat ? "bg-[#38BDF8]/20 text-[#38BDF8]" : "text-[#64748B] hover:text-[#38BDF8]"}`,
							children: [
								CATEGORY_ICONS[cat] || "📍",
								" ",
								cat
							]
						}, cat))]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
				children: filtered.map((poi) => /* @__PURE__ */ jsxs("div", {
					className: "panel p-4 hover:border-[#38BDF8]/30 transition-colors",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between mb-2",
						children: [/* @__PURE__ */ jsx("h4", {
							className: "font-semibold text-[#38BDF8] text-sm",
							children: poi.name
						}), /* @__PURE__ */ jsx("span", {
							className: "text-xs px-2 py-0.5 rounded bg-[#1B2534] text-[#8896A8] capitalize",
							children: poi.category
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 text-xs text-[#64748B]",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }), poi.ward]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(Star, { className: "w-3 h-3 text-[#FFB020]" }), poi.rating]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(Users, { className: "w-3 h-3" }),
									poi.footfall_estimate.toLocaleString(),
									"/d"
								]
							})
						]
					})]
				}, poi.id))
			}),
			events.length > 0 && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 mt-4",
				children: [/* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-[#8B5CF6]" }), /* @__PURE__ */ jsx("span", {
					className: "eyebrow",
					children: "Upcoming Local Events"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
				children: events.map((evt) => /* @__PURE__ */ jsxs("div", {
					className: "panel p-4",
					children: [/* @__PURE__ */ jsx("h4", {
						className: "font-semibold text-[#38BDF8] text-sm",
						children: evt.name
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 mt-2 text-xs text-[#64748B]",
						children: [
							/* @__PURE__ */ jsx("span", { children: evt.date }),
							/* @__PURE__ */ jsx("span", { children: evt.venue }),
							/* @__PURE__ */ jsxs("span", { children: [evt.expected_attendance.toLocaleString(), " expected"] })
						]
					})]
				}, evt.id))
			})] })
		]
	});
};
//#endregion
//#region src/components/EnergyPanel.jsx
var EnergyPanel = () => {
	const [energy, setEnergy] = useState([]);
	const [water, setWater] = useState([]);
	const [efficiency, setEfficiency] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const API = "";
				const [energyRes, waterRes, effRes] = await Promise.all([
					fetch(`${API}/api/energy/energy`),
					fetch(`${API}/api/energy/water`),
					fetch(`${API}/api/energy/efficiency`)
				]);
				if (!energyRes.ok) throw new Error("Failed to load utility data");
				setEnergy(await energyRes.json());
				if (waterRes.ok) setWater(await waterRes.json());
				if (effRes.ok) setEfficiency(await effRes.json());
				setError(null);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "panel h-48 flex items-center justify-center",
		children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" })
	});
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: "panel p-5 text-[#FF9497] flex items-center gap-2",
		children: [
			/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5" }),
			" ",
			error
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			efficiency && /* @__PURE__ */ jsxs("div", {
				className: "panel p-5 border-l-4",
				style: { borderLeftColor: "#F59E0B" },
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 mb-2",
						children: [/* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-[#F59E0B]" }), /* @__PURE__ */ jsx("span", {
							className: "eyebrow",
							children: "Smart Utilities — AI Assessment"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-[#38BDF8] leading-relaxed",
						children: efficiency.interpretation
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-4 mt-3 text-xs text-[#8896A8]",
						children: [
							/* @__PURE__ */ jsxs("span", { children: [
								"☀️ Solar: ",
								efficiency.avg_solar_adoption_pct,
								"%"
							] }),
							/* @__PURE__ */ jsxs("span", { children: [
								"🌿 Green: ",
								efficiency.avg_green_energy_pct,
								"%"
							] }),
							/* @__PURE__ */ jsxs("span", { children: [
								"💧 Water loss: ",
								efficiency.avg_water_loss_pct,
								"%"
							] })
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
				children: energy.map((e) => {
					const wData = water.find((w) => w.ward === e.ward);
					return /* @__PURE__ */ jsxs("div", {
						className: "panel p-4 hover:border-[#38BDF8]/30 transition-colors",
						children: [/* @__PURE__ */ jsx("h4", {
							className: "font-semibold text-[#38BDF8] text-sm mb-3",
							children: e.ward
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1 text-[#8896A8]",
										children: [/* @__PURE__ */ jsx(Zap, { className: "w-3 h-3" }), " Consumption"]
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[#38BDF8] font-mono",
										children: [(e.avg_kwh_per_month / 1e3).toFixed(0), "k kWh/mo"]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1 text-[#8896A8]",
										children: [/* @__PURE__ */ jsx(Sun, { className: "w-3 h-3" }), " Solar adoption"]
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[#10B981] font-mono",
										children: [e.solar_adoption_pct, "%"]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "flex items-center gap-1 text-[#8896A8]",
										children: "Green energy"
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[#10B981] font-mono",
										children: [e.green_pct, "%"]
									})]
								}),
								wData && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1 text-[#8896A8]",
										children: [/* @__PURE__ */ jsx(Droplets, { className: "w-3 h-3" }), " Water quality"]
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[#38BDF8] font-mono",
										children: [wData.water_quality_index, "/100"]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "flex items-center gap-1 text-[#8896A8]",
										children: "Water loss"
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[#FF5A5F] font-mono",
										children: [wData.loss_pct, "%"]
									})]
								})] })
							]
						})]
					}, e.ward);
				})
			}),
			efficiency && /* @__PURE__ */ jsxs("div", {
				className: "panel p-4",
				children: [/* @__PURE__ */ jsx("h4", {
					className: "font-semibold text-[#38BDF8] text-sm mb-3",
					children: "Ward Efficiency Rankings"
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-2",
					children: efficiency.ward_rankings.map((w, i) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-[#0E141E]",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-[#64748B] font-mono",
								children: ["#", i + 1]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[#38BDF8]",
								children: w.ward
							})]
						}), /* @__PURE__ */ jsxs("span", {
							className: `font-mono ${w.efficiency_score >= 70 ? "text-[#10B981]" : w.efficiency_score >= 50 ? "text-[#FFB020]" : "text-[#FF5A5F]"}`,
							children: [w.efficiency_score, "/100"]
						})]
					}, w.ward))
				})]
			})
		]
	});
};
//#endregion
//#region src/components/AgenticPlanner.jsx
var PLAN_ICONS = {
	ideal_commute: Map,
	disaster_preparedness: Shield,
	simulate_impact: TestTube,
	tourism_hotspots: Compass
};
var AgenticPlanner = () => {
	const [planTypes, setPlanTypes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [executing, setExecuting] = useState(null);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);
	useEffect(() => {
		const fetchTypes = async () => {
			try {
				const res = await fetch(`/api/plan/types`);
				if (res.ok) setPlanTypes(await res.json());
			} catch (err) {
				console.error("Failed to load plan types:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchTypes();
	}, []);
	const executePlan = async (planType) => {
		setExecuting(planType);
		setResult(null);
		setError(null);
		try {
			const res = await fetch(`/api/plan`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ plan_type: planType })
			});
			if (!res.ok) throw new Error("Planning workflow failed");
			setResult(await res.json());
		} catch (err) {
			setError(err.message);
		} finally {
			setExecuting(null);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "panel p-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 mb-4",
				children: [/* @__PURE__ */ jsx(Cpu, { className: "w-4 h-4 text-[#8B5CF6]" }), /* @__PURE__ */ jsx("span", {
					className: "eyebrow",
					children: "AI Agent · Multi-Step Planning (ADK)"
				})]
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "h-32 flex items-center justify-center",
				children: /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin text-[#38BDF8]" })
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3",
				children: planTypes.map((pt) => {
					const Icon = PLAN_ICONS[pt.id] || Cpu;
					return /* @__PURE__ */ jsxs("button", {
						onClick: () => executePlan(pt.id),
						disabled: executing !== null,
						className: `p-4 rounded-xl border text-left transition-all ${executing === pt.id ? "bg-[#8B5CF6]/20 border-[#8B5CF6]/50" : "bg-[#0E141E] border-[#263244] hover:border-[#8B5CF6]/40 hover:-translate-y-0.5"} disabled:opacity-70`,
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 mb-2",
							children: [
								/* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 text-[#8B5CF6]" }),
								/* @__PURE__ */ jsx("span", {
									className: "text-sm font-semibold text-[#38BDF8]",
									children: pt.label
								}),
								executing === pt.id && /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin ml-auto text-[#8B5CF6]" })
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-[#64748B] leading-relaxed",
							children: pt.description
						})]
					}, pt.id);
				})
			}),
			error && /* @__PURE__ */ jsxs("div", {
				className: "mt-4 flex items-center gap-2 text-[#FF9497] text-sm bg-[#FF5A5F]/10 p-3 rounded-xl border border-[#FF5A5F]/30",
				children: [
					/* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4" }),
					" ",
					error
				]
			}),
			result && /* @__PURE__ */ jsxs("div", {
				className: "mt-5 border-t border-[#263244] pt-5 space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 mb-2",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-[#8B5CF6]" }), /* @__PURE__ */ jsx("span", {
							className: "eyebrow",
							children: "Planning Result"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "bg-[#0E141E] rounded-xl p-4 border border-[#263244]",
						children: /* @__PURE__ */ jsx("p", {
							className: "text-sm text-[#38BDF8] leading-relaxed",
							children: result.summary
						})
					}),
					result.top_choices && /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: result.top_choices.map((choice, i) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3 bg-[#0E141E] p-3 rounded-xl border border-[#263244]",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-[#64748B] font-mono text-xs w-5",
								children: ["#", i + 1]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-sm font-semibold text-[#38BDF8]",
									children: choice.route
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-[#64748B] mt-0.5",
									children: choice.reason
								})]
							})]
						}, i))
					}),
					result.priority_wards && /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: result.priority_wards.map((w, i) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3 bg-[#0E141E] p-3 rounded-xl border border-[#263244]",
							children: [/* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full mt-1.5 ${w.risk_score >= 70 ? "bg-[#FF5A5F]" : w.risk_score >= 40 ? "bg-[#FFB020]" : "bg-[#10B981]"}` }), /* @__PURE__ */ jsxs("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-sm font-semibold text-[#38BDF8]",
										children: w.ward
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "ml-2 text-xs text-[#64748B]",
										children: [
											"Risk: ",
											w.risk_score,
											"/100"
										]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-[#64748B] mt-0.5",
										children: w.reason
									}),
									w.recommended_action && /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-[#10B981] mt-1",
										children: ["→ ", w.recommended_action]
									})
								]
							})]
						}, i))
					}),
					result.simulation && /* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [result.simulation.map((s, i) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between bg-[#0E141E] p-3 rounded-xl border border-[#263244] text-xs",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[#38BDF8] font-medium",
								children: s.ward
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-[#64748B]",
								children: [
									"AQI: ",
									s.current_aqi,
									" → ",
									/* @__PURE__ */ jsx("span", {
										className: "text-[#10B981]",
										children: s.projected_aqi
									}),
									" (↓",
									s.improvement,
									")"
								]
							})]
						}, i)), result.policy_recommendation && /* @__PURE__ */ jsxs("p", {
							className: "text-xs text-[#FFB020] italic mt-2",
							children: ["Policy: ", result.policy_recommendation]
						})]
					}),
					result.top_hotspots && /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: result.top_hotspots.map((h, i) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3 bg-[#0E141E] p-3 rounded-xl border border-[#263244]",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-[#FFB020] font-mono text-xs w-5",
								children: ["#", h.rank]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-sm font-semibold text-[#38BDF8]",
										children: h.name
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "ml-2 text-xs text-[#64748B]",
										children: ["Score: ", h.potential_score]
									}),
									h.recommendation && /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-[#10B981] mt-0.5",
										children: ["→ ", h.recommendation]
									})
								]
							})]
						}, i))
					}),
					/* @__PURE__ */ jsx(ExplainabilityPanel, {
						explain: {
							confidence: .85,
							confidence_label: "high",
							rationale: `Multi-step agentic workflow executed across ${result.plan_type} domain, synthesizing data from traffic, environment, public safety, tourism, and energy modules.`,
							sources: [{
								plan_type: result.plan_type,
								executed_at: result.executed_at
							}],
							method: "ADK-style agentic planning (multi-tool orchestration)"
						},
						title: "How this was planned"
					})
				]
			})
		]
	});
};
//#endregion
//#region src/components/LookerEmbed.jsx
var LookerEmbed = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: "panel p-5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 mb-4",
			children: [
				/* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4 text-[#8B5CF6]" }),
				/* @__PURE__ */ jsx("span", {
					className: "eyebrow",
					children: "Looker Studio · City Official Dashboard"
				}),
				/* @__PURE__ */ jsxs("a", {
					href: "https://lookerstudio.google.com/embed/reporting/placeholder",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "ml-auto flex items-center gap-1 text-xs text-[#38BDF8] hover:underline",
					children: [/* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" }), " Open in Looker"]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "bg-[#0E141E] rounded-xl border border-[#263244] p-6 text-center",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "w-16 h-16 mx-auto mb-4 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center",
					children: /* @__PURE__ */ jsx(BarChart3, { className: "w-8 h-8 text-[#8B5CF6]" })
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "text-lg font-semibold text-[#38BDF8] mb-2",
					children: "Looker Studio Integration"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm text-[#64748B] max-w-xl mx-auto leading-relaxed mb-4",
					children: "Connect your BigQuery tables to Looker Studio for a comprehensive city-official dashboard with drill-down ward analysis, trend comparisons, and exportable reports."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "inline-flex items-center gap-2 bg-[#1B2534] rounded-lg px-4 py-2 text-xs text-[#64748B]",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[#10B981]",
						children: "●"
					}), " BigQuery tables: traffic_summary, incidents, environment, energy, tourism_poi"]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left",
					children: [
						{
							label: "Traffic Trends",
							desc: "Hourly congestion by corridor"
						},
						{
							label: "Incident Heatmap",
							desc: "Safety incidents by ward"
						},
						{
							label: "Livability Scorecard",
							desc: "Cross-domain ward ranking"
						},
						{
							label: "Energy Efficiency",
							desc: "Solar & water metrics"
						}
					].map((item) => /* @__PURE__ */ jsxs("div", {
						className: "bg-[#131A26] rounded-lg p-3 border border-[#263244]",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm font-semibold text-[#38BDF8] block",
							children: item.label
						}), /* @__PURE__ */ jsx("span", {
							className: "text-xs text-[#64748B]",
							children: item.desc
						})]
					}, item.label))
				})
			]
		})]
	});
};
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<nav class="section-nav" aria-label="Section quick navigation"><div class="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto custom-scrollbar"><a href="#operations" class="section-nav-link">Operations</a><span class="section-nav-divider" aria-hidden="true"></span><a href="#health" class="section-nav-link">Health</a><span class="section-nav-divider" aria-hidden="true"></span><a href="#telemetry" class="section-nav-link">Telemetry</a><span class="section-nav-divider" aria-hidden="true"></span><a href="#wards" class="section-nav-link">Wards</a><span class="section-nav-divider" aria-hidden="true"></span><a href="#community" class="section-nav-link">Community</a><span class="section-nav-divider" aria-hidden="true"></span><a href="#economy" class="section-nav-link">Economy</a><span class="section-nav-divider" aria-hidden="true"></span><a href="#utilities" class="section-nav-link">Utilities</a><span class="section-nav-divider" aria-hidden="true"></span><a href="#planning" class="section-nav-link">AI Planning</a><span class="section-nav-divider" aria-hidden="true"></span><a href="#analytics" class="section-nav-link">Analytics</a></div></nav><div class="page-content"><!-- ───── Section 1: AI Query Bar ───── --><section id="query" class="content-section"><div class="section-inner">${renderComponent($$result, "QueryBar", QueryBar, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/QueryBar.jsx",
		"client:component-export": "default"
	})}</div></section><!-- ───── Section 2: Live Operations (Map + Alerts) ───── --><section id="operations" class="content-section"><div class="section-header"><span class="section-indicator" style="background:var(--amber)"></span><h2 class="section-title">Live Operations</h2><span class="section-eyebrow">Map · Anomalies · Recommendations</span></div><div class="layout-ops"><div class="layout-ops-main">${renderComponent($$result, "MapView", null, {
		"client:only": "react",
		"client:component-hydration": "only",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/MapView.jsx",
		"client:component-export": "default"
	})}</div><div class="layout-ops-side">${renderComponent($$result, "AlertsPanel", AlertsPanel, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/AlertsPanel.jsx",
		"client:component-export": "default"
	})}<div class="mt-4">${renderComponent($$result, "RecommendationCard", RecommendationCard, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/RecommendationCard.jsx",
		"client:component-export": "default"
	})}</div></div></div></section><!-- ───── Section 3: Health & Air Quality ───── --><section id="health" class="content-section"><div class="section-header"><span class="section-indicator" style="background:#8B5CF6"></span><h2 class="section-title">Health &amp; Air Quality</h2><span class="section-eyebrow">AQI · Advisories · Vulnerable Groups</span></div>${renderComponent($$result, "HealthAdvisory", HealthAdvisory, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/HealthAdvisory.jsx",
		"client:component-export": "default"
	})}</section><!-- ───── Section 4: Live Telemetry ───── --><section id="telemetry" class="content-section"><div class="section-header"><span class="section-indicator" style="background:var(--flow)"></span><h2 class="section-title">Live Telemetry</h2><span class="section-eyebrow">KPIs · Trends · Forecasts</span></div>${renderComponent($$result, "Dashboard", Dashboard, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/Dashboard.jsx",
		"client:component-export": "default"
	})}</section><!-- ───── Section 5: Ward Livability ───── --><section id="wards" class="content-section"><div class="section-header"><span class="section-indicator" style="background:#10B981"></span><h2 class="section-title">Ward Livability</h2><span class="section-eyebrow">Scores · Metrics · Interpretation</span></div>${renderComponent($$result, "WardDetailPanel", WardDetailPanel, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/WardDetailPanel.jsx",
		"client:component-export": "default"
	})}</section><!-- ───── Section 6: Community & Actions ───── --><section id="community" class="content-section"><div class="section-header"><span class="section-indicator" style="background:#F59E0B"></span><h2 class="section-title">Community &amp; Actions</h2><span class="section-eyebrow">Action Center · Citizen Reporting</span></div><div class="layout-community">${renderComponent($$result, "ActionCenter", ActionCenter, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/ActionCenter.jsx",
		"client:component-export": "default"
	})}${renderComponent($$result, "CitizenReport", CitizenReport, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/CitizenReport.jsx",
		"client:component-export": "default"
	})}</div></section><!-- ───── Section 7: Tourism & Local Economy ───── --><section id="economy" class="content-section planner-only"><div class="section-header"><span class="section-indicator" style="background:#10B981"></span><h2 class="section-title">Tourism &amp; Local Economy</h2><span class="section-eyebrow">POIs · Events · Economic Impact</span></div>${renderComponent($$result, "TourismPanel", TourismPanel, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/TourismPanel.jsx",
		"client:component-export": "default"
	})}</section><!-- ───── Section 8: Energy & Smart Utilities ───── --><section id="utilities" class="content-section planner-only"><div class="section-header"><span class="section-indicator" style="background:#F59E0B"></span><h2 class="section-title">Energy &amp; Smart Utilities</h2><span class="section-eyebrow">Consumption · Efficiency · Water Quality</span></div>${renderComponent($$result, "EnergyPanel", EnergyPanel, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/EnergyPanel.jsx",
		"client:component-export": "default"
	})}</section><!-- ───── Section 9: AI Agentic Planning (ADK) ───── --><section id="planning" class="content-section"><div class="section-header"><span class="section-indicator" style="background:#8B5CF6"></span><h2 class="section-title">AI Multi-Step Planning</h2><span class="section-eyebrow">Agentic Workflows · Cross-Domain Reasoning</span></div>${renderComponent($$result, "AgenticPlanner", AgenticPlanner, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/AgenticPlanner.jsx",
		"client:component-export": "default"
	})}</section><!-- ───── Section 10: Looker Studio Analytics ───── --><section id="analytics" class="content-section planner-only"><div class="section-header"><span class="section-indicator" style="background:#8B5CF6"></span><h2 class="section-title">City Analytics</h2><span class="section-eyebrow">Looker Studio · Embedded Reports</span></div>${renderComponent($$result, "LookerEmbed", LookerEmbed, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/himan/Desktop/citypulse/frontend/src/components/LookerEmbed.jsx",
		"client:component-export": "default"
	})}</section></div>` })}`;
}, "C:/Users/himan/Desktop/citypulse/frontend/src/pages/index.astro", void 0);
var $$file = "C:/Users/himan/Desktop/citypulse/frontend/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
