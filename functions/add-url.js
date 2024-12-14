export async function onRequest(context) {
    const { request, env } = context;
    let urls = JSON.parse(env.URLS || '[]'); // Parse the existing URLs or start with an empty array

    if (request.method === 'POST') {
        const { url } = await request.json();
        const id = urls.length;
        urls.push({ url, id });
        // Update the environment variable (you'll need to manually update it in Cloudflare Dashboard for now)
        env.URLS = JSON.stringify(urls);
        return new Response(JSON.stringify({ path: `/video/${id}` }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response('Method Not Allowed', {
        status: 405,
        headers: { 'Allow': 'POST' }
    });
}
