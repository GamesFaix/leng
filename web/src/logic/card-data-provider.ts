import { CardDataProvider } from "leng-core/src/domain/interfaces";
import { Card, Set } from "leng-core/src/domain/encyclopedia";

export const cardsPath = "data/encyclopedia/cards.json";
export const setsPath = "data/encyclopedia/sets.json";

const getAllCards = async (): Promise<Card[]> => {
  const path = `../../${cardsPath}`;
  console.log("getAllCards");
  const json = await fetch(path);
  console.log("decoding card JSON...");
  const data: Card[] = await json.json();
  console.log(`decoded ${data.length} cards`);
  return data;
};

const getAllSets = async (): Promise<Set[]> => {
  const path = `../../${setsPath}`;
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
