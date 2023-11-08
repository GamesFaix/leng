import { CardDataProvider } from "leng-core/src/logic/interfaces";
import { Card, Set } from "scryfall-api";

const getAllCards = async (): Promise<Card[]> => {
  const path = "../../data/cards.json";
  console.log("getAllCards");
  const json = await fetch(path);
  console.log("decoding card JSON...");
  const data: Card[] = await json.json();
  console.log(`decoded ${data.length} cards`);
  return data;
};

const getAllSets = async (): Promise<Set[]> => {
  const path = "../../data/sets.json";
  console.log(path);
  const json = await fetch(path);
  console.log("decoding set JSON...");
  const data: Set[] = await json.json();
  console.log(`decoded ${data.length} sets`);
  return data;
};

export const cardDataProvider: CardDataProvider = {
  getAllCards,
  getAllSets,
};
