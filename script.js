// Constants
const PLAYER_URL = 'https://shz.al/Sffb/livecricplayer.html?dtv=';
const API_URL = 'https://raw.githubusercontent.com/drmlive/fancode-live-events/main/fancode.json';

// DOM Elements
const matchesContainer = document.getElementById('matches');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const noMatches = document.getElementById('noMatches');
const themeToggle = document.querySelector('.theme-toggle');
const scrollToTop = document.querySelector('.scroll-to-top');
const filterButtons = document.querySelectorAll('.filter-btn');

// State
let matches = [];
let currentFilter = 'all';

// Theme Management
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Match Filtering and Display
function filterMatches(matches, filter, searchTerm = '') {
    return matches.filter(match => {
        const matchesFilter = filter === 'all' || match.status.toLowerCase() === filter;
        const matchesSearch = match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            match.team_1.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            match.team_2.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });
}

function createMatchCard(match) {
    const statusClass = match.status.toLowerCase() === 'live' ? 'status-live' : 'status-upcoming';
    const card = document.createElement('div');
    card.className = 'match-item';
    card.innerHTML = `
        <div class="match-image">
            <img src="${match.src}" alt="${match.title}" loading="lazy">
            <span class="match-status ${statusClass}">${match.status}</span>
        </div>
        <div class="match-content">
            <h3>${match.event_name}</h3>
            <p class="teams">${match.team_1} vs ${match.team_2}</p>
            <button class="stream-button" onclick="window.location.href='${PLAYER_URL}${match.adfree_url}'">
                Watch Now
                <i class="fas fa-play-circle"></i>
            </button>
        </div>
    `;
    return card;
}

function displayMatches(filteredMatches) {
    matchesContainer.innerHTML = '';
    if (filteredMatches.length === 0) {
        noMatches.style.display = 'flex';
        return;
    }
    noMatches.style.display = 'none';
    filteredMatches.forEach(match => {
        matchesContainer.appendChild(createMatchCard(match));
    });
}

// Event Listeners
searchInput.addEventListener('input', debounce(() => {
    const filtered = filterMatches(matches, currentFilter, searchInput.value);
    displayMatches(filtered);
}, 300));

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        const filtered = filterMatches(matches, currentFilter, searchInput.value);
        displayMatches(filtered);
    });
});

themeToggle.addEventListener('click', toggleTheme);

window.addEventListener('scroll', () => {
    scrollToTop.style.display = window.scrollY > 500 ? 'block' : 'none';
});

scrollToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize
async function init() {
    try {
        // Set initial theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        // Fetch matches
        loader.style.display = 'flex';
        const response = await fetch(API_URL);
        const data = await response.json();
        matches = data.matches.sort((a, b) => {
            if (a.status.toLowerCase() === 'live') return -1;
            if (b.status.toLowerCase() === 'live') return 1;
            return 0;
        });
        
        displayMatches(matches);
    } catch (error) {
        console.error('Error initializing app:', error);
        matchesContainer.innerHTML = '<p class="error">Failed to load matches. Please try again later.</p>';
    } finally {
        loader.style.display = 'none';
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
