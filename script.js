class MatchesApp {
    constructor() {
        this.matchesContainer = document.getElementById('matchesContainer');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.updateTimeElement = document.getElementById('updateTime');
        this.apiUrl = 'https://raw.githubusercontent.com/drmlive/fancode-live-events/main/fancode.json';
        this.playerURL = 'https://shz.al/Sffb/livecricplayer.html?dtv=';
        this.retryAttempts = 3;
        this.retryDelay = 5000;
        this.matches = [];
    }

    async init() {
        try {
            this.showLoading();
            await this.fetchMatchesWithRetry();
            this.hideLoading();
            this.renderMatches();
            this.updateLastUpdateTime();
            this.setupAutoRefresh();
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to load matches. Please try again later.');
            console.error('Initialization failed:', error);
        }
    }

    showLoading() {
        this.loadingIndicator.style.display = 'flex';
        this.matchesContainer.style.display = 'none';
    }

    hideLoading() {
        this.loadingIndicator.style.display = 'none';
        this.matchesContainer.style.display = 'grid';
    }

    async fetchMatchesWithRetry() {
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await fetch(this.apiUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                this.matches = data.matches.map(match => ({
                    ...match,
                    contentId: match.match_id,
                    isLive: match.status.toLowerCase() === 'live',
                    event_name: `${match.team_1} vs ${match.team_2}`,
                    event_category: match.event_name,
                    src: match.src || 'default-image-url.jpg'
                }));
                return;
            } catch (error) {
                if (attempt === this.retryAttempts) throw error;
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            }
        }
    }

    updateLastUpdateTime() {
        const now = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour12: true
        };
        this.updateTimeElement.textContent = `Last updated: ${now.toLocaleString('en-US', options)}`;
    }

    createMatchCard(match) {
        const statusClass = match.isLive ? 'status-live' : 'status-upcoming';
        const statusText = match.isLive ? 'LIVE' : 'Upcoming';

        return `
            <article class="match-card" data-id="${match.contentId}">
                <div class="match-image-container">
                    <img 
                        src="${match.src}" 
                        alt="${match.event_name}"
                        class="match-image"
                        loading="lazy"
                        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1 1\'%3E%3C/svg%3E'"
                    >
                    <div class="overlay-play-icon">
                        <svg fill="white" height="24" width="24" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                    <span class="category-badge">${match.event_category}</span>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="match-content">
                    <h2 class="match-title">${match.event_name}</h2>
                    <div class="match-details">
                        <div class="match-info">
                            <span class="channel">${match.broadcast_channel || ''}</span>
                            <span class="language">${match.audioLanguageName || ''}</span>
                        </div>
                    </div>
                    <button class="stream-button" onclick="app.playMatch('${match.contentId}')">
                        <svg class="play-icon" fill="currentColor" height="20" width="20" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        Watch Now
                    </button>
                </div>
            </article>
        `;
    }

    renderMatches() {
        if (!this.matches?.length) {
            this.showError('No matches available at the moment.');
            return;
        }

        const sortedMatches = [...this.matches].sort((a, b) => {
            if (a.isLive && !b.isLive) return -1;
            if (!a.isLive && b.isLive) return 1;
            return 0;
        });

        this.matchesContainer.innerHTML = sortedMatches
            .map(match => this.createMatchCard(match))
            .join('');

        this.addMatchCardListeners();
    }

    playMatch(matchId) {
        window.location.href = `${this.playerURL}${matchId}`;
    }

    addMatchCardListeners() {
        const cards = document.querySelectorAll('.match-card');
        cards.forEach(card => {
            const matchId = card.dataset.id;
            
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.stream-button')) {
                    this.playMatch(matchId);
                }
            });
        });
    }

    showError(message) {
        this.matchesContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button class="stream-button" onclick="app.init()">Try Again</button>
            </div>
        `;
    }

    setupAutoRefresh() {
        setInterval(() => this.refreshData(), 5 * 60 * 1000); // Refresh every 5 minutes
    }

    async refreshData() {
        try {
            await this.fetchMatchesWithRetry();
            this.renderMatches();
            this.updateLastUpdateTime();
        } catch (error) {
            console.error('Refresh failed:', error);
        }
    }
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MatchesApp();
    app.init();
});

// Handle visibility change to refresh data when tab becomes visible
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && app) {
        app.refreshData();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    if (app) app.init();
});

window.addEventListener('offline', () => {
    if (app) app.showError('You are currently offline. Please check your internet connection.');
});
