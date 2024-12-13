// router.js

function loadVideo() {
    const videoContainer = document.getElementById("videoContainer");
    const path = window.location.pathname;

    let iframeSrc = "";

    if (path === "/fan") {
        iframeSrc = "https://www.livereacting.com/tools/hls-player-embed?url=https%3A%2F%2Fbitdash-a.akamaihd.net%2Fcontent%2Fsintel%2Fhls%2Fplaylist.m3u8";
    } else if (path === "/jio") {
        iframeSrc = "https://www.livereacting.com/tools/hls-player-embed?url=https%3A%2F%2Fdai.fancode.com%2Fprimary%2F112348_english_hls_6202ta-di%2Findex.m3u8";
    } else {
        iframeSrc = "https://www.livereacting.com/tools/hls-player-embed?url=https%3A%2F%2Fprod-sportsp-south.jiocinema.com%2Fhls%2Flive%2F2109981%2Fhd_akamai_merged_avc_eng_bwf_m2_121224%2Fmobile_master.m3u8%3Fhdnts%3Dst%3D1734005485~exp%3D1734012685~acl%3D%2Fhls%2Flive%2F2109981%2Fhd_akamai_merged_avc_eng_bwf_m2_121224%2F*~id%3D1dc089a8497b4db3a8d62e99f00599bd~data%3DrqId%3D7a30cb5a-9ae9-4014-a94a-930857236885.1~hmac%3D72d88bda16d4a9a91939556482ff4e4ed180b2c0f9b7b4727710b189a08b291b";
    }

    const iframe = document.createElement("iframe");
    iframe.src = iframeSrc;
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;
    iframe.id = "videoIframe";

    videoContainer.innerHTML = "";
    videoContainer.appendChild(iframe);
}

// Call the function when the page loads
window.onload = loadVideo;

// Play/Pause button functionality
$("#playPauseBtn").click(function () {
    const iframe = document.getElementById("videoIframe");
    const player = iframe.contentWindow.document.querySelector("video");
    
    if (player.paused) {
        player.play();
        $(this).text("Pause");
    } else {
        player.pause();
        $(this).text("Play");
    }
});

// Seekbar functionality
$("#seekbar").on("input", function () {
    const iframe = document.getElementById("videoIframe");
    const player = iframe.contentWindow.document.querySelector("video");
    const seekValue = $(this).val();
    player.currentTime = player.duration * (seekValue / 100);
});

// Volume slider functionality
$("#volumeSlider").on("input", function () {
    const iframe = document.getElementById("videoIframe");
    const player = iframe.contentWindow.document.querySelector("video");
    const volumeValue = $(this).val() / 100;
    player.volume = volumeValue;
});

// Fullscreen button functionality
$("#fullscreenBtn").click(function () {
    const iframe = document.getElementById("videoIframe");
    const player = iframe.contentWindow.document.querySelector("video");

    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari and Opera
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
    }
});
