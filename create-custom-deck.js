document.getElementById("deckForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("deckName").value.trim();
  const primer = document.getElementById("deckPrimer").value.trim();
  const text = document.getElementById("deckText").value.trim();

  const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30);
  const deck = { id, name, primer, rawText: text };

  localStorage.setItem("customDeck-" + id, JSON.stringify(deck));
  window.location.href = "custom-deck.html?deck=" + id;
});
