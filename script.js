// Constants
const playerURL = "https://shz.al/Sffb/livecricplayer.html?dtv=";
const apiURL = "https://raw.githubusercontent.com/drmlive/fancode-live-events/main/fancode.json";

// Global variables
let allMatches = [];
let currentFilter = 'all';

// DOM Elements
const matchesContainer = document.getElementById('matches');
const filterButtons = document.querySelectorAll('.filter-btn');
const matchTemplate = document.getElementById('match-template');

// Fetch and display matches
async function fetchMatches() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        allMatches = data.matches;
        displayMatches(allMatches);
        initializeFilters();
    } catch (error) {
        console.error('Error fetching matches:', error);
        matchesContainer.innerHTML = '<div class="error">Error loading matches. Please try again later.</div>';
    }
}

// Display matches
function displayMatches(matches) {
    matchesContainer.innerHTML = '';
    
    if (matches.length === 0) {
        matchesContainer.innerHTML = '<div class="no-matches">No matches found</div>';
        return;
    }

    // Sort matches (LIVE first, then upcoming)
    matches.sort((a, b) => {
        if (a.status.toLowerCase() === 'live' && b.status.toLowerCase() !== 'live') return -1;
        if (a.status.toLowerCase() !== 'live' && b.status.toLowerCase() === 'live') return 1;
        return new Date(a.startTime) - new Date(b.startTime);
    });

    matches.forEach(match => {
        const matchCard = createMatchCard(match);
        matchesContainer.appendChild(matchCard);
    });
}

// Create match card
function createMatchCard(match) {
    const clone = matchTemplate.content.cloneNode(true);
    
    // Set match details
    const matchItem = clone.querySelector('.match-item');
    const image = clone.querySelector('.match-image');
    const status = clone.querySelector('.status');
    const title = clone.querySelector('.match-title');
    const team1 = clone.querySelector('.team-1');
    const team2 = clone.querySelector('.team-2');
    const eventName = clone.querySelector('.event-name');
    const watchBtn = clone.querySelector('.watch-btn');

    // Set data attributes
    matchItem.dataset.category = match.event_category;
    matchItem.dataset.status = match.status.toLowerCase();

    // Set content
    image.src = match.src;
    image.alt = match.title;
    status.textContent = match.status;
    status.classList.add(match.status.toLowerCase() === 'live' ? 'status-live' : 'status-upcoming');
    title.textContent = match.title;
    team1.textContent = match.team_1;
    team2.textContent = match.team_2;
    eventName.textContent = match.event_name;

    // Handle watch button
    if (match.status.toLowerCase() === 'live') {
        watchBtn.addEventListener('click', () => {
            window.location.href = playerURL + match.adfree_url;
        });
    } else {
        watchBtn.textContent = 'Coming Soon';
        watchBtn.classList.add('disabled');
    }

    return clone;
}

// Initialize filter functionality
function initializeFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Apply filter
            currentFilter = button.dataset.filter;
            filterMatches(currentFilter);
        });
    });
}

// Filter matches
function filterMatches(filter) {
    let filteredMatches = allMatches;

    switch(filter) {
        case 'live':
            filteredMatches = allMatches.filter(match => 
                match.status.toLowerCase() === 'live'
            );
            break;
        case 'upcoming':
            filteredMatches = allMatches.filter(match => 
                match.status.toLowerCase() === 'upcoming'
            );
            break;
        case 'Cricket':
        case 'Football':
            filteredMatches = allMatches.filter(match => 
                match.event_category === filter
            );
            break;
        // 'all' case will use all matches
    }

    displayMatches(filteredMatches);
}

// Auto-refresh live matches every 5 minutes
function setupAutoRefresh() {
    setInterval(fetchMatches, 300000); // 5 minutes
}

// Initialize application
function init() {
    fetchMatches();
    setupAutoRefresh();
}

// Start the application
document.addEventListener('DOMContentLoaded', init);

// Add some helper functions for time formatting if needed
function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName.toLowerCase() === 'img') {
        e.target.src = 'placeholder.png'; // Replace with your placeholder image
    }
}, true);
