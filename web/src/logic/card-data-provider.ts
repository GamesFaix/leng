import { CardDataProvider } from "leng-core/src/logic/interfaces";
import { Card, Set } from "scryfall-api";

const getAllCards = async (): Promise<Card[]> => {
  const path = "../../data/cards.json";
  console.log(path);
  const json = await fetch(path);
  return await json.json();
};

const getAllSets = async (): Promise<Set[]> => {
  const path = "../../data/sets.json";
  console.log(path);
  const json = await fetch(path);
  return await json.json();
};

export const cardDataProvider: CardDataProvider = {
  getAllCards,
  getAllSets,
};
