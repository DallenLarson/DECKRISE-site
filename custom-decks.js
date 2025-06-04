window.addEventListener("DOMContentLoaded", async () => {
  const deckGrid = document.getElementById("deckGrid");
  const sortMode = document.getElementById("sortMode");
  const apiKey = "7e56dabe-1394-4d6e-aa3b-f7250070b899";

  function loadCachedPrices() {
    return JSON.parse(localStorage.getItem("customDeckPrices") || "{}");
  }

  function saveCachedPrices(prices) {
    localStorage.setItem("customDeckPrices", JSON.stringify(prices));
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
      } catch (e) {
        console.warn("Error fetching card price:", cardId);
      }
    }

    return parseFloat(total.toFixed(2));
  }

  function getDecksArray(useLivePrices = false, cachedPrices = {}) {
    return Object.entries(deckStats).filter(([id]) => id.startsWith("custom-")).map(([id, data]) => ({
      id,
      name: data.name,
      sprite: data.sprite || "https://r2.limitlesstcg.net/pokemon/ball/ultra.png",
      price: useLivePrices ? (cachedPrices[id] ?? data.price ?? 0) : (data.price ?? 0)
    }));
  }

  function renderDecks(decks, sortBy = "name") {
    deckGrid.innerHTML = "";

    if (sortBy === "name") {
      decks.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      decks.sort((a, b) => b[sortBy] - a[sortBy]);
    }

    decks.forEach(deck => {
      const card = document.createElement("a");
      card.href = `custom-deck.html?deck=${deck.id}`;
      card.className = "deck-card";
      card.innerHTML = `
        <img src="${deck.sprite}" alt="${deck.name}" />
        <h2>${deck.name}</h2>
        <p><strong>Price: $${deck.price.toFixed(2)}</strong></p>
      `;
      deckGrid.appendChild(card);
    });
  }

  const initialDecks = getDecksArray();
  renderDecks(initialDecks);

  const livePrices = loadCachedPrices();
  const updatedPrices = {};

  for (const [id, data] of Object.entries(deckStats)) {
    if (id.startsWith("custom-") && !livePrices[id]) {
      const price = await getDeckPrice(data.cardList);
      updatedPrices[id] = price;
      livePrices[id] = price;
    }
  }

  saveCachedPrices(livePrices);
  const decksWithLivePrices = getDecksArray(true, livePrices);
  renderDecks(decksWithLivePrices, sortMode.value);

  sortMode.addEventListener("change", (e) => {
    renderDecks(getDecksArray(true, loadCachedPrices()), e.target.value);
  });
});
