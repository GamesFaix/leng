import { CardDataProvider } from "leng-core/src/domain/interfaces";
import { Card, Set } from "leng-core/src/domain/encyclopedia";

const dir = "../../data/encyclopedia";

const getAllCards = async (): Promise<Card[]> => {
  const path = `${dir}/cards.json`;
  console.log("getAllCards");
  const json = await fetch(path, { cache: "force-cache" });
  console.log("decoding card JSON...");
  const data: Card[] = await json.json();
  console.log(`decoded ${data.length} cards`);
  return data;
};

const getAllSets = async (): Promise<Set[]> => {
  const path = `${dir}/sets.json`;
  console.log(path);
  const json = await fetch(path, { cache: "force-cache" });
  console.log("decoding set JSON...");
  const data: Set[] = await json.json();
  console.log(`decoded ${data.length} sets`);
  return data;
};

export const cardDataProvider: CardDataProvider = {
  getAllCards,
  getAllSets,
};
