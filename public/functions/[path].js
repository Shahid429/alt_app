export async function onRequest(context) {
    const { request, params } = context;
    const path = decodeURIComponent(params.path);

    // Ensure the path starts with a valid URL
    if (!path.startsWith('http')) {
        return new Response('Invalid HLS link!', { status: 400 });
    }

    // Redirect to index.html with the HLS link as a query parameter
    return new Response(null, {
        status: 301,
        headers: {
            Location: `/index.html?hls=${encodeURIComponent(path)}`, // Redirect to the video page with the HLS link
        },
    });
}


