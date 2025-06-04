window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const deck = JSON.parse(localStorage.getItem("customDecks") || "{}")[urlParams.get("deck")];

  if (!deck) {
    document.body.innerHTML = "<h1 style='text-align:center;'>Deck not found</h1>";
    return;
  }

  document.getElementById("deck-name").textContent = deck.name;
  document.getElementById("deckTitle").textContent = deck.name;
  document.getElementById("big-name").textContent = deck.name;
  document.getElementById("deckPrimer").textContent = deck.primer;
  document.getElementById("deckText").textContent = deck.text;

  const sprite = document.getElementById("sprite");
  sprite.src = deck.sprite || "fallback.png";
  document.getElementById("deck-art").src = deck.sprite || "fallback.png";
});