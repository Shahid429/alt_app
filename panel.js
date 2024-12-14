function submitUrl() {
    const urlInput = document.getElementById('hls-url').value;
    if (urlInput) {
        fetch('https://rough-sun-1675.shahidmir52141.workers.dev/add-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlInput })
        })
        .then(response => response.json())
        .then(data => {
            const urlList = document.getElementById('url-list');
            const newItem = document.createElement('li');
            newItem.innerHTML = `<a href="https://rakhfc.pages.dev${data.path}" target="_blank">${data.path}</a>`;
            urlList.appendChild(newItem);
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert("Please enter a valid HLS stream URL.");
    }
}
