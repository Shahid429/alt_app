export async function onRequest(context) {
    const { params, env } = context;
    const urls = JSON.parse(await env.URLS_KV.get('urls') || '[]');
    const id = params.id;
    const videoUrl = urls[id]?.url;

    if (!videoUrl) {
        return new Response('Video not found', { status: 404 });
    }

    return new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Video Player</title>
            <link rel="stylesheet" href="https://cdn.plyr.io/3.6.2/plyr.css">
            <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
            <script src="https://cdn.plyr.io/3.6.2/plyr.polyfilled.js"></script>
        </head>
        <body>
            <video id="player" controls preload="metadata" class="plyr"></video>
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    const videoSrc = "${videoUrl}";
                    const video = document.getElementById('player');
                    if (Hls.isSupported()) {
                        const hls = new Hls();
                        hls.loadSource(videoSrc);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED, function() {
                            video.play();
                        });
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = videoSrc;
                        video.addEventListener('loadedmetadata', function() {
                            video.play();
                        });
                    }
                    const player = new Plyr(video, {
                        captions: { active: true, update: false },
                    });
                });
            </script>
        </body>
        </html>
    `, {
        headers: { 'Content-Type': 'text/html' }
    });
}
