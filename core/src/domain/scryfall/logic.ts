import { Card, SearchOptions, Set, Cards } from "scryfall-api";
import { BulkData, ScryfallResponse } from "./types";

const baseUrl = "https://api.scryfall.com";

const getBulkData = async () => {
  const httpResponse1 = await fetch(`${baseUrl}/bulk-data`);
  const scryfallResponse: ScryfallResponse<BulkData[]> =
    await httpResponse1.json();
  const defaultCardsInfo = scryfallResponse.data.find(
    (x) => x.type === "default_cards"
  );
  if (!defaultCardsInfo) {
    throw Error("Could not find bulk data file info.");
  }
  return defaultCardsInfo;
};

export const getAllCards = async (): Promise<Card[]> => {
  const bulkData = await getBulkData();
  const httpResponse2 = await fetch(bulkData.download_uri);
  const cards: Card[] = await httpResponse2.json();
  return cards.filter((c) => !c.digital); // Filter out MTGO sets
};

export const getAllSets = async () : Promise<Set[]> => {
  const httpResponse = await fetch(`${baseUrl}/sets`);
  const scryfallResponse: ScryfallResponse<Set[]> = await httpResponse.json();
  return scryfallResponse.data;
};

const options: SearchOptions = {
  include_variations: true,
  unique: "prints",
};

export async function searchScryfall(query: string): Promise<Card[]> {
  return await Cards.search(query, options).all();
}
