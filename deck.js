const params = new URLSearchParams(window.location.search);
const deckId = params.get("deck");
const deck = deckStats[deckId];

if (deck) {
  document.getElementById("deck-name").textContent = deck.name;
  document.getElementById("big-name").textContent = deck.bigText;
  document.getElementById("deck-art").src = deck.image;
  document.getElementById("sprite").src = deck.sprite;
  document.getElementById("share-day1").textContent = deck.shareDay1;
  document.getElementById("share-day2").textContent = deck.shareDay2;
  document.getElementById("win-rate").textContent = deck.winRate;
  document.getElementById("tie-rate").textContent = deck.tieRate;
  document.getElementById("conversion").textContent = deck.conversion;

  const table = document.getElementById("matchup-table");
  deck.matchups.forEach(m => {
    const row = document.createElement("tr");

    const opponentEntry = Object.entries(deckStats).find(
      ([_, data]) => data.name.toLowerCase() === m.opponent.toLowerCase()
    );

    const spriteCell = document.createElement("td");
    if (opponentEntry) {
      const spriteImg = document.createElement("img");
      spriteImg.src = opponentEntry[1].sprite;
      spriteImg.alt = m.opponent;
      spriteImg.className = "opponent-sprite";
      spriteCell.appendChild(spriteImg);
    } else {
      spriteCell.textContent = "—";
    }

    const nameCell = document.createElement("td");
    nameCell.textContent = m.opponent;

    const winCell = document.createElement("td");
    const winRate = m.winRate;
    winCell.textContent = winRate.toFixed(1) + "%";
    const green = Math.min(255, Math.round((winRate / 100) * 255));
    const red = 255 - green;
    winCell.style.backgroundColor = `rgb(${red}, ${green}, 64)`;
    winCell.style.color = "#000";

    const tieCell = document.createElement("td");
    tieCell.textContent = m.tieRate.toFixed(1) + "%";

    row.appendChild(spriteCell);
    row.appendChild(nameCell);
    row.appendChild(winCell);
    row.appendChild(tieCell);
    table.appendChild(row);
  });

  if (deck.cardList) {
  document.getElementById("decklist-loading").style.display = "block";
  renderVisualDecklist(deck.cardList);
}
  if (deck.pilotedBy) {
    const info = document.getElementById("player-info");
    info.innerHTML = `<h3>Piloted By:</h3><ul>` + deck.pilotedBy.map(p => `<li>${p}</li>`).join("") + `</ul>`;
  }

  if (deck.primer) {
    const guide = document.getElementById("deck-guide");
    guide.innerHTML = `<h3>Deck Primer</h3><p>${deck.primer}</p>`;
  }
} else {
  document.body.innerHTML = "<h1 style='text-align:center;padding:2em;'>Deck not found</h1>";
}

async function renderVisualDecklist(list) {
  const container = document.createElement("div");
  container.className = "decklist-block";
  container.id = "decklist-block";

  let totalPrice = 0;

  async function makeSection(title, cards) {
    const section = document.createElement("div");
    section.className = "decklist-section";
    const heading = document.createElement("h3");
    heading.textContent = title;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "card-grid";

    for (const entry of cards) {
      const cardId = `${entry.set}-${entry.number}`;
      try {
        let card = JSON.parse(localStorage.getItem(cardId));
      if (!card) {
        const res = await fetch(`https://api.pokemontcg.io/v2/cards/${cardId}`, {
          headers: { "X-Api-Key": "7e56dabe-1394-4d6e-aa3b-f7250070b899" }
        });
        const data = await res.json();
        card = data.data;
        localStorage.setItem(cardId, JSON.stringify(card));
      }

        entry.name = card.name;

        // Price Calculation
        let price = 0;
        const priceData = card.tcgplayer?.prices;
        if (priceData) {
          const priceTypes = Object.values(priceData);
          if (priceTypes.length > 0 && priceTypes[0].market) {
            price = priceTypes[0].market * entry.count;
            totalPrice += price;
          }
        }

        const cardDiv = document.createElement("div");
        cardDiv.className = "card-entry";
        cardDiv.innerHTML = `
          <span class="card-count-badge">${entry.count}</span>
          <img src="${card.images.small}" alt="${card.name}">
          <div class="card-info">${card.name} (${entry.set.toUpperCase()} ${entry.number})</div>
          <div class="card-price">${price ? `$${(price / entry.count).toFixed(2)} ea` : 'N/A'}</div>
        `;
        grid.appendChild(cardDiv);
      } catch {
        const fallback = document.createElement("div");
        fallback.className = "card-entry";
        fallback.innerHTML = `<div class="card-info">⚠️ ${entry.set.toUpperCase()} ${entry.number}</div>`;
        grid.appendChild(fallback);
      }
    }

    section.appendChild(grid);
    container.appendChild(section);
  }

  await makeSection("Pokémon", list.pokemon);
  await makeSection("Trainer", list.trainer);
  await makeSection("Energy", list.energy);

  // Total Price Display
  const priceDisplay = document.createElement("h3");
  priceDisplay.className = "deck-price";
  priceDisplay.textContent = `Total Deck Price: $${totalPrice.toFixed(2)}`;
  container.prepend(priceDisplay);

  document.getElementById("decklist-container").appendChild(container);
  document.getElementById("decklist-loading").style.display = "none";
}

document.getElementById("export-deck-btn").addEventListener("click", () => {
  if (!deck?.cardList) return alert("❌ No deck loaded.");
  const { pokemon = [], trainer = [], energy = [] } = deck.cardList;

  function section(title, cards) {
    return `${title}:\n` + cards.map(c =>
      `${c.count} ${c.name || "???"} ${c.set.toUpperCase()} ${c.number}`
    ).join("\n") + "\n\n";
  }

  const text = section("Pokémon", pokemon) +
               section("Trainer", trainer) +
               section("Energy", energy);

  navigator.clipboard.writeText(text.trim()).then(() =>
    alert("✅ Deck exported and copied!")
  );
});
