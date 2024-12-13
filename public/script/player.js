document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('video');
    const errorDisplay = document.getElementById('error-display');
    const hlsLink = decodeURIComponent(window.location.pathname.slice(1));

    if (!hlsLink) {
        errorDisplay.textContent = 'No HLS link provided!';
        return;
    }

    try {
        const player = new shaka.Player(video);
        player.addEventListener('error', (event) => {
            console.error('Shaka Player Error:', event.detail);
            errorDisplay.textContent = `An error occurred: ${event.detail.message}`;
        });

        await player.load(hlsLink);
        console.log('Video loaded successfully!');
    } catch (error) {
        console.error('Error loading video:', error);
        errorDisplay.textContent = 'Failed to load video!';
    }
});
