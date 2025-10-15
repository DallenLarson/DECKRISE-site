export async function handler(event) {
    try {
      const source = event.queryStringParameters.source || "trainerhill";
  
      let url;
      if (source === "limitless") {
        // Limitless TCG (GraphQL)
        url = "https://limitlesstcg.com/api/graphql";
        const query = {
          query: `
            {
              deckSearch(game: "PTCG", limit: 10, sort: "rank") {
                name
                archetype
                win_rate
                usage
                image
              }
            }
          `,
        };
  
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        });
  
        const data = await response.json();
        return {
          statusCode: 200,
          body: JSON.stringify({ source: "limitless", data }),
        };
      }
  
      // TrainerHill fallback
      url = "https://www.trainerhill.com/api/decklist?game=PTCG";
      const response = await fetch(url);
      const data = await response.json();
  
      return {
        statusCode: 200,
        body: JSON.stringify({ source: "trainerhill", data }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }
  