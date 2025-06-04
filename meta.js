const deckStats = window.deckStats;


window.addEventListener("DOMContentLoaded", async () => {
  const deckGrid = document.getElementById("deckGrid");
  const sortMode = document.getElementById("sortMode");
  const apiKey = "7e56dabe-1394-4d6e-aa3b-f7250070b899";

  function loadCachedPrices() {
    return JSON.parse(localStorage.getItem("deckPrices") || "{}");
  }

  function saveCachedPrices(prices) {
    localStorage.setItem("deckPrices", JSON.stringify(prices));
  }

  async function getDeckPrice(cardList) {
    if (!cardList) return 0;
    let total = 0;
    const all = [...(cardList.pokemon || []), ...(cardList.trainer || []), ...(cardList.energy || [])];

    for (const entry of all) {
      const cardId = `${entry.set}-${entry.number}`;
      try {
        const res = await fetch(`https://api.pokemontcg.io/v2/cards/${cardId}`, {
          headers: { "X-Api-Key": apiKey }
        });
        const data = await res.json();
        const priceTypes = Object.values(data.data.tcgplayer?.prices || {});
        if (priceTypes.length && priceTypes[0].market) {
          total += priceTypes[0].market * entry.count;
        }
      } catch {
        console.warn("Price error:", cardId);
      }
    }

    return parseFloat(total.toFixed(2));
  }

  function getDecksArray(useLivePrices = false, cachedPrices = {}) {
    return Object.entries(deckStats)
      .filter(([_, d]) => d.shareDay1 && d.shareDay1.trim() !== "")
      .map(([id, d]) => {
        const trend = (parseFloat(d.shareDay1) ?? 0) < (parseFloat(d.shareRate) ?? 0)
          ? "up"
          : "down";
        return {
          id,
          name: d.name,
          icon: d.sprite,
          share: parseFloat(d.shareRate) || 0,
          winRate: parseFloat(d.winRate) || 0,
          topCut: d.conversion || "TBD",
          price: useLivePrices ? (cachedPrices[id] ?? d.price ?? 0) : (d.price ?? 0),
          trend
        };
      });
  }

  function renderDecks(decks, sortKey = "share") {
    deckGrid.innerHTML = "";

    if (sortKey === "name") {
      decks.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      decks.sort((a, b) => b[sortKey] - a[sortKey]);
    }

    decks.forEach((deck, i) => {
      const row = document.createElement("div");
      row.className = `deck-row${i === 0 ? " rank-1" : i === 1 ? " rank-2" : i === 2 ? " rank-3" : ""}`;
      row.innerHTML = `
  <div class="deck-info">
    <img src="${deck.icon}" alt="${deck.name}" />
    <div class="deck-details">
      <h2>${deck.name}</h2>
      <div class="deck-stats">
        Share: ${deck.share.toFixed(2)}%<br>
        Win Rate: ${deck.winRate.toFixed(1)}%<br>
        Top Cut: ${deck.topCut}
      </div>
    </div>
  </div>
  <div class="deck-price">
    $${deck.price.toFixed(2)}<br>
    <span class="${deck.trend === 'up' ? 'trend-up' : 'trend-down'}">
      ${deck.trend === 'up' ? '⬆️' : '⬇️'}
    </span>
    <a href="deck.html?deck=${deck.id}" class="deck-btn">View Deck</a>
  </div>
`;
      deckGrid.appendChild(row);
    });
  }

  // Initial decks (without live prices)
  const initialDecks = getDecksArray();
  renderDecks(initialDecks);

  // Get live prices and cache
  const cached = loadCachedPrices();
  const updatedPrices = {};
  for (const [id, d] of Object.entries(deckStats)) {
    if (!cached[id]) {
      const price = await getDeckPrice(d.cardList);
      updatedPrices[id] = price;
      cached[id] = price;
    }
  }
  saveCachedPrices(cached);

  const decksWithPrices = getDecksArray(true, cached);
  renderDecks(decksWithPrices, sortMode.value);

  sortMode.addEventListener("change", (e) => {
    renderDecks(getDecksArray(true, loadCachedPrices()), e.target.value);
  });
});
