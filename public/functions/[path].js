export async function onRequest(context) {
    const { request, params } = context;
    const path = decodeURIComponent(params.path);

    if (!path.startsWith('http')) {
        return new Response('Invalid HLS link!', { status: 400 });
    }

    return new Response(null, {
        status: 301,
        headers: {
            Location: `/index.html?url=${encodeURIComponent(path)}`, // Redirect to index.html with URL as a query parameter
        },
    });
}

