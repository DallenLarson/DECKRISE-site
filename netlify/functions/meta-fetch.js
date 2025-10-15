export async function handler(event) {
    try {
      const source = event.queryStringParameters.source || "trainerhill";
      let url, response, data;
  
      if (source === "limitless") {
        // Limitless GraphQL API (requires POST)
        url = "https://limitlesstcg.com/api/graphql";
        const query = {
          query: `
            query {
              deckSearch(game: "PTCG", limit: 10, sort: "rank") {
                id
                name
                archetype
                win_rate
                usage
                image
                tournament {
                  name
                }
              }
            }
          `,
        };
  
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        });
  
        // Try to parse JSON safely
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error("❌ Limitless returned non-JSON:", text.slice(0, 200));
          throw new Error("Limitless returned invalid JSON");
        }
  
        return {
          statusCode: 200,
          body: JSON.stringify({ source: "limitless", data }),
        };
      }
  
      // TrainerHill fallback (this part already works fine)
      url = "https://www.trainerhill.com/api/decklist?game=PTCG";
      response = await fetch(url);
      data = await response.json();
  
      return {
        statusCode: 200,
        body: JSON.stringify({ source: "trainerhill", data }),
      };
    } catch (err) {
      console.error("⚠️ Proxy error:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }
  