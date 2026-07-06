export const prerender = false;

export async function GET({ request }) {
  const target = import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL || '';
  const url = new URL(request.url);
  const path = url.searchParams.get('path') || '/api/health';
  const upstream = new URL(path, target || 'http://localhost:3001');

  const response = await fetch(upstream, {
    headers: {
      'content-type': 'application/json'
    }
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') || 'application/json'
    }
  });
}
