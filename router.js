// router.js

function loadVideo() {
    const videoContainer = document.getElementById("videoContainer");
    const path = window.location.pathname;

    let iframeSrc = "";

    // Check the path and set the iframe source accordingly
    if (path === "/fan") {
        iframeSrc = "https://www.livereacting.com/tools/hls-player-embed?url=https%3A%2F%2Fbitdash-a.akamaihd.net%2Fcontent%2Fsintel%2Fhls%2Fplaylist.m3u8";
    } else if (path === "/jio") {
        iframeSrc = "https://www.livereacting.com/tools/hls-player-embed?url=https%3A%2F%2Fdai.fancode.com%2Fprimary%2F112348_english_hls_6202ta-di%2Findex.m3u8";
    } else {
        // Default case if path doesn't match
        iframeSrc = "https://www.livereacting.com/tools/hls-player-embed?url=https%3A%2F%2Fbitdash-a.akamaihd.net%2Fcontent%2Fsintel%2Fhls%2Fplaylist.m3u8";
    }

    // Create the iframe element dynamically
    const iframe = document.createElement("iframe");
    iframe.src = iframeSrc;
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;

    // Clear previous content and append the new iframe
    videoContainer.innerHTML = "";
    videoContainer.appendChild(iframe);
}

// Call the function when the page loads
window.onload = loadVideo;
