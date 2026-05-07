const SENHA = 'cadinho2025';
const KV_KEY = 'cadinho_db';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Auth',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // Autenticação via header X-Auth
    const auth = request.headers.get('X-Auth');
    if (auth !== SENHA) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers
      });
    }

    // GET — carregar dados
    if (request.method === 'GET') {
      const data = await env.CADINHO_KV.get(KV_KEY);
      return new Response(data || 'null', { headers });
    }

    // POST — salvar dados
    if (request.method === 'POST') {
      const body = await request.text();
      await env.CADINHO_KV.put(KV_KEY, body);
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers
    });
  }
};
