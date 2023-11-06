import { CardDataProvider } from "leng-core/src/logic/interfaces";
import { AppSettings } from "leng-core/src/logic/model";
import { Card, Set } from "scryfall-api";

type BulkData = {
  object: string;
  id: string;
  type: string;
  updatedAt: string;
  uri: string;
  name: string;
  description: string;
  compressed_size: number;
  download_uri: string;
  content_type: string;
  content_encoding: string;
};

type ScryfallResponse<T> = {
  object: string;
  has_more: boolean;
  data: T;
};

const baseUrl = "https://api.scryfall.com";

const getAllCards = async (_: AppSettings): Promise<Card[]> => {
  const httpResponse1 = await fetch(`${baseUrl}/bulk-data`);
  const scryfallResponse: ScryfallResponse<BulkData[]> =
    await httpResponse1.json();
  const defaultCardsInfo = scryfallResponse.data.find(
    (x) => x.type === "default_cards"
  );
  if (!defaultCardsInfo) {
    throw Error("Could not find bulk data file info.");
  }
  const httpResponse2 = await fetch(defaultCardsInfo.download_uri);
  const cards: Card[] = await httpResponse2.json();
  return cards.filter((c) => !c.digital); // Filter out MTGO sets
}

const getAllSets = async () => {
  const httpResponse = await fetch(`${baseUrl}/sets`);
  const scryfallResponse: ScryfallResponse<Set[]> = await httpResponse.json();
  return scryfallResponse.data;
};

export const cardDataProvider: CardDataProvider = {
  getAllCards,
  getAllSets,
};
