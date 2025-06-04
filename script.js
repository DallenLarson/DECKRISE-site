// Reveal animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.classList.remove('hidden');
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.card').forEach(card => observer.observe(card));

// Upcoming event logic
const events = [
  { day: 1, time: "16:00", name: "Fellowship Hobbies and Games – 4pm" },
  { day: 1, time: "18:30", name: "Card Traders of Austin – 6:30pm" },
  { day: 2, time: "18:30", name: "Game Kastle – 6:30pm" },
  { day: 2, time: "18:00", name: "Dragon's Lair Austin – 6pm" },
  { day: 3, time: "19:00", name: "Banditos – 7pm" },
  { day: 3, time: "19:00", name: "Mothership – 7pm" },
  { day: 4, time: "18:30", name: "Wylder Gaming – 6:30pm" },
  { day: 4, time: "19:00", name: "Pixelhaven – 7pm" },
  { day: 5, time: "18:30", name: "Space Goblin Collectables – 6:30pm" },
  { day: 5, time: "19:00", name: "Multiverse Hobbies – 7pm" },
  { day: 6, time: "09:00", name: "Round Rock Library – 9am" },
  { day: 6, time: "12:00", name: "Tako Games – 12pm" },
];

function isUpcoming(day, time) {
  const now = new Date();
  const eventDate = new Date();
  const [hour, minute] = time.split(":");
  eventDate.setHours(hour, minute, 0, 0);
  return now.getDay() === day && now < eventDate;
}

const eventList = document.getElementById("event-list");
events.forEach(e => {
  if (isUpcoming(e.day, e.time)) {
    const div = document.createElement("div");
    div.className = "event-block";
    div.textContent = e.name;
    eventList.appendChild(div);
  }
});
