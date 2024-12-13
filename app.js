import videojs from 'video.js';

// Video stream URLs for different routes
const videoURLs = {
  '/fan': 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  '/jio': 'https://dai.fancode.com/primary/112348_english_hls_6202ta-di/index.m3u8',
};

// Get the current URL path
const path = window.location.pathname;

// Determine the correct video URL
const videoURL = videoURLs[path] || null;

if (videoURL) {
  // Initialize the Video.js player
  const player = videojs('video-player', {
    autoplay: false,
    controls: true,
    sources: [{ src: videoURL, type: 'application/x-mpegURL' }],
    playbackRates: [0.5, 1, 1.5, 2], // Add playback speed options
  });

  // Example: Log a message when the video starts playing
  player.on('play', () => {
    console.log('Video started playing:', videoURL);
  });
} else {
  document.getElementById('player-container').innerHTML = '<p>Invalid path or video not available.</p>';
}
