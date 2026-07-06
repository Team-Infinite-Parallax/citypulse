export { renderers } from '../../renderers.mjs';

const prerender = false;
async function GET({ request }) {
  const target = process.env.PUBLIC_API_URL || "";
  const url = new URL(request.url);
  const path = url.searchParams.get("path") || "/api/health";
  const upstream = new URL(path, target || "http://localhost:3001");
  const response = await fetch(upstream, {
    headers: {
      "content-type": "application/json"
    }
  });
  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") || "application/json"
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
