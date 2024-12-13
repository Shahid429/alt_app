document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('video-player');
    const errorDisplay = document.getElementById('error-display');
    const hlsLink = decodeURIComponent(window.location.pathname.slice(1));

    if (!hlsLink) {
        errorDisplay.textContent = 'No HLS link provided!';
        return;
    }

    try {
        // Set the iframe src with the HLS link
        iframe.src = `https://www.livereacting.com/tools/hls-player-embed?url=${encodeURIComponent(hlsLink)}`;
    } catch (error) {
        errorDisplay.textContent = 'Failed to load the player!';
    }
});
