let urls = [];

export async function onRequest(context) {
    const { request } = context;

    if (request.method === 'POST') {
        const { url } = await request.json();
        const id = urls.length;
        urls.push({ url, id });
        return new Response(JSON.stringify({ path: `/video/${id}` }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response('Method Not Allowed', {
        status: 405,
        headers: { 'Allow': 'POST' }
    });
}
