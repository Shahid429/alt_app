// Initialize AOS for animations
AOS.init({
  duration: 1000,
  once: true,
});

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  themeToggle.innerHTML = body.classList.contains("dark") ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Fetch Live Matches from API
const matchList = document.getElementById("match-list");

async function fetchLiveMatches() {
  try {
    const response = await fetch("https://api.jsonbin.io/v3/qs/67aeee26acd3cb34a8e1b189"); // Replace with your API endpoint
    const data = await response.json();
    displayMatches(data);
  } catch (error) {
    console.error("Error fetching live matches:", error);
  }
}

// Display Matches
function displayMatches(matches) {
  matchList.innerHTML = ""; // Clear previous content
  matches.forEach((match) => {
    const matchCard = document.createElement("div");
    matchCard.classList.add("match-card");
    matchCard.innerHTML = `
      <h3>${match.team1} vs ${match.team2}</h3>
      <p>Status: ${match.status}</p>
      <button class="btn btn-custom" onclick="window.location.href='fancode.html?path=fancode'" data-aos="flip-left">
        <i class="fas fa-fan"></i> Fancode Stream
      </button>
      <button class="btn btn-custom" onclick="window.location.href='jio.html?path=jio'" data-aos="flip-right">
        <i class="fas fa-play-circle"></i> Jio Stream
      </button>
      <button class="btn btn-custom" onclick="window.location.href='astro.html?path=astro'" data-aos="flip-right">
        <i class="fas fa-play-circle"></i> Astro 60Fps
      </button>
      <button class="btn btn-custom" onclick="window.location.href='willow.html?path=willow'" data-aos="flip-right">
        <i class="fas fa-play-circle"></i> Willow 4k
      </button>
    `;
    matchList.appendChild(matchCard);
  });
}

// Refresh Match List Every 5 Minutes
setInterval(fetchLiveMatches, 300000);

// Initial Fetch
fetchLiveMatches();
