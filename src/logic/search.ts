import * as scryfall from "scryfall-api";
import { Card, SearchOptions } from "scryfall-api";

const options: SearchOptions = {
  include_variations: true,
  unique: "prints",
};

export async function searchScryfall(query: string): Promise<Card[]> {
  console.log(`Searching scryfall for '${query}'...`);
  const results = await scryfall.Cards.search(query, options).all();
  console.log(`Found ${results.length} results, including ${results[0]?.name}`);
  return results;
}
