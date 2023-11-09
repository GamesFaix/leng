import { CardDataProvider } from "leng-core/src/domain/interfaces";
import { getAllCards, getAllSets } from "leng-core/src/domain/scryfall";

export const cardDataProvider: CardDataProvider = {
  getAllCards: (_) => getAllCards(),
  getAllSets: (_) => getAllSets(),
};
