import videojs from 'https://cdn.jsdelivr.net/npm/video.js@7.11.8/dist/video.js';

// Ensure the video player is initialized once the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const player = videojs('video-player', {
    autoplay: true,  // Autoplay the video
    controls: true,  // Show controls
    sources: [{
      src: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8', // Video source
      type: 'application/x-mpegURL', // Specify HLS type
    }],
    playbackRates: [0.5, 1, 1.5, 2], // Playback speed options
  });

  player.on('play', () => {
    console.log('Video started playing');
  });
});
