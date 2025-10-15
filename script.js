// Card reveal when scrolled into view
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.classList.remove('hidden');
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.card').forEach(card => observer.observe(card));

// Slide-in animation on page load
window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.remove('hidden');
      card.classList.add('visible');
    }, 300 + index * 300);
  });

  renderTodayEvents();
});


// Event data
const events = [
  { day: 1, time: "16:00", name: "Fellowship Hobbies and Games", display: "4pm", official: false, address: "1710 N Farm to Market 1626, Buda, TX 78610", turnout: 10, cap: 24 },
  { day: 1, time: "18:30", name: "Card Traders of Austin", display: "6:30pm", official: false, address: "8650 Spicewood Springs Rd #133A, Austin, TX 78759", turnout: 12, cap: 32 },
  { day: 2, time: "18:30", name: "Game Kastle", display: "6:30pm", official: false, address: "3407 Wells Branch Pkwy suite 800, Austin, TX 78728", turnout: 8, cap: 32 },
  { day: 2, time: "18:00", name: "Dragon's Lair Austin", display: "6pm", official: true, address: "2438 W Anderson Ln, Austin, TX", turnout: 30, cap: 64 },
  { day: 3, time: "19:00", name: "Banditos", display: "7pm", official: true, address: "3509 Hyridge Dr, Austin, TX 78759", turnout: 14, cap: 16 },
  { day: 3, time: "19:00", name: "Mothership", display: "7pm", official: true, address: "2121 Parmer Ln, Austin, TX", turnout: 20, cap: 48 },
  { day: 4, time: "18:30", name: "Wylder Gaming", display: "6:30pm", official: false, address: "456 Card Ln, Austin, TX", turnout: 15, cap: 30 },
  { day: 4, time: "19:00", name: "PixelHaven", display: "7pm", official: false, address: "5400 Jain Ln, Austin, TX", turnout: 25, cap: 50 },
  { day: 5, time: "18:30", name: "Space Goblin Collectables", display: "6:30pm", official: false, address: "567 Goblin Rd, Austin, TX", turnout: 5, cap: 20 },
  { day: 5, time: "19:00", name: "Multiverse Hobbies", display: "7pm", official: false, address: "678 Dimension Dr, Austin, TX", turnout: 18, cap: 40 },
  { day: 6, time: "09:00", name: "Round Rock Library", display: "9am", official: false, address: "216 E Main St, Round Rock, TX", turnout: 20, cap: 50 },
  { day: 6, time: "12:00", name: "Tako Games", display: "12pm", official: false, address: "789 Sushi Ln, Austin, TX", turnout: 12, cap: 30 },
];

// Render only today's upcoming events
function renderTodayEvents() {
  const now = new Date();
  const today = now.getDay();
  const eventList = document.getElementById("event-list");

  let anyUpcoming = false;

  events.forEach(e => {
    if (e.day !== today) return;

    const [hour, minute] = e.time.split(":");
    const eventTime = new Date();
    eventTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

    if (eventTime <= now) return;

    anyUpcoming = true;

    const div = document.createElement("div");
    div.className = "event-block";

    div.innerHTML = `
      <h3>
        ${e.official ? `<img class="play-icon" src="https://support.pokemon.com/hc/theming_assets/01HZPDEPH6V7M07TX2XYT0XAAV" alt="Play! Store">` : ""}
        ${e.name} – ${e.display}
      </h3>
      <p><strong>Today</strong> @ ${e.display}</p>
      <p><strong>Location:</strong> <a href="https://maps.google.com/?q=${encodeURIComponent(e.address)}" target="_blank">${e.address}</a></p>
      <p><strong>Usual Turnout:</strong> ~${e.turnout} / <strong>Cap:</strong> ${e.cap}</p>
    `;

    eventList.appendChild(div);
  });

  if (!anyUpcoming) {
    eventList.innerHTML = `<p>No more events today. Check back tomorrow!</p>`;
  }
}
