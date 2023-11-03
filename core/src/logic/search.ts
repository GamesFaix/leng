import * as scryfall from "scryfall-api";
import { Card, SearchOptions } from "scryfall-api";

const options: SearchOptions = {
  include_variations: true,
  unique: "prints",
};

export async function searchScryfall(query: string): Promise<Card[]> {
  return await scryfall.Cards.search(query, options).all();
}
