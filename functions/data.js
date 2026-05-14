const PASS = '12121212';
const KV_KEY = 'cadinho_db';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Auth via query param
  const pass = url.searchParams.get('pass');
  if (pass !== PASS) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // GET — lê dados
  if (request.method === 'GET') {
    const data = await env.CADINHO_KV.get(KV_KEY);
    return new Response(data || '{}', {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // POST — salva dados
  if (request.method === 'POST') {
    const body = await request.text();
    await env.CADINHO_KV.put(KV_KEY, body);
    return new Response('OK', { status: 200 });
  }

  return new Response('Not Found', { status: 404 });
}
