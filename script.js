// script.js
document.getElementById("playPauseBtn").addEventListener("click", function () {
    const iframe = document.querySelector("iframe");
    const player = iframe.contentWindow;

    // Toggle play/pause
    player.postMessage('{"event":"command","func":"playPause"}', '*');
});

document.getElementById("volumeSlider").addEventListener("input", function (event) {
    const iframe = document.querySelector("iframe");
    const player = iframe.contentWindow;
    const volume = event.target.value / 100;

    // Adjust volume
    player.postMessage('{"event":"command","func":"setVolume","args":["' + volume + '"]}', '*');
});
