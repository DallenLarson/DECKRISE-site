// user.js
let username = "Dallen";
let decks = {
  "slaking": {
    name: "Slaking ex Aggro",
    wins: 3,
    losses: 2,
    ties: 1,
    matchups: {
      "Fezandipity": { wins: 1, losses: 1 },
      "Gardevoir": { wins: 2, losses: 1 }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("username").textContent = username;

  renderDecks();
  populateDeckDropdown();

  document.getElementById("match-form").addEventListener("submit", e => {
    e.preventDefault();
    const deckId = document.getElementById("deck-select").value;
    const opponent = document.getElementById("opponent-deck").value.trim();
    const result = document.getElementById("result-select").value;

    if (!decks[deckId].matchups[opponent]) {
      decks[deckId].matchups[opponent] = { wins: 0, losses: 0, ties: 0 };
    }
    decks[deckId][result + "s"]++;
    decks[deckId].matchups[opponent][result + "s"] = (decks[deckId].matchups[opponent][result + "s"] || 0) + 1;

    renderDecks();
    e.target.reset();
  });
});

function renderDecks() {
  const container = document.getElementById("deck-records");
  container.innerHTML = "";

  Object.entries(decks).forEach(([id, deck]) => {
    const total = deck.wins + deck.losses + deck.ties;
    const winRate = ((deck.wins / total) * 100).toFixed(1);

    const div = document.createElement("div");
    div.className = "deck-record";
    div.innerHTML = `
      <div>
        <h3>${deck.name}</h3>
        <p>Record: ${deck.wins}-${deck.losses}-${deck.ties}</p>
        <p>Win Rate: ${winRate}%</p>
      </div>
      <a href="deck.html?id=${id}" style="color:limegreen;">View Deck</a>
    `;
    container.appendChild(div);
  });
}

function populateDeckDropdown() {
  const select = document.getElementById("deck-select");
  Object.entries(decks).forEach(([id, deck]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = deck.name;
    select.appendChild(option);
  });
}
