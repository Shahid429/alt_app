// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1200,
});

// Example Socket.io code for live chat
const socket = io();
socket.on('message', function(msg) {
    console.log('Message from server:', msg);
});
