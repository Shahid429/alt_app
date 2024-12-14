export async function onRequest(context) {
    const { request, env } = context;

    if (request.method === 'POST') {
        const { url } = await request.json();
        const urls = JSON.parse(await env.URLS_KV.get('urls') || '[]');
        const id = urls.length;
        urls.push({ url, id });
        await env.URLS_KV.put('urls', JSON.stringify(urls));
        return new Response(JSON.stringify({ path: `/video/${id}` }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response('Method Not Allowed', {
        status: 405,
        headers: { 'Allow': 'POST' }
    });
}
