import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/proxy.js
var proxy_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
async function GET({ request }) {
	const target = process.env.PUBLIC_API_URL || "";
	const path = new URL(request.url).searchParams.get("path") || "/api/health";
	const upstream = new URL(path, target || "http://localhost:3001");
	const response = await fetch(upstream, { headers: { "content-type": "application/json" } });
	return new Response(await response.text(), {
		status: response.status,
		headers: { "content-type": response.headers.get("content-type") || "application/json" }
	});
}
//#endregion
//#region \0virtual:astro:page:src/pages/api/proxy@_@js
var page = () => proxy_exports;
//#endregion
export { page };
