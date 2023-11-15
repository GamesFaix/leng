import { CardDataProvider } from "leng-core/src/domain/interfaces";
import { Card, Set } from "leng-core/src/domain/encyclopedia";
import { loadFile } from "./file-loader";

export const cardDataProvider: CardDataProvider = {
  getAllCards: () => loadFile<Card[]>("encyclopedia/cards.json"),
  getAllSets: () => loadFile<Set[]>("encyclopedia/sets.json"),
};
