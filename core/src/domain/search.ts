import { Card, Cards, SearchOptions } from "scryfall-api";

const options: SearchOptions = {
  include_variations: true,
  unique: "prints",
};

export async function searchScryfall(query: string): Promise<Card[]> {
  return await Cards.search(query, options).all();
}
