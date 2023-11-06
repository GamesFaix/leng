import { ImagePathProvider } from "leng-core/src/logic/interfaces";
import { AppSettings, normalizeName } from "leng-core/src/logic/model";
import { Card, Set } from "scryfall-api";

const getSetSymbolPath = (settings: AppSettings, set: Set): string =>
  // Need "set-" prefix to avoid naming Conflux icon "con", which is a reserved name in Windows
  `${settings.dataPath}/encyclopedia/setSymbols/set-${set.code}.svg`;

const getCardImagePath = (settings: AppSettings, card: Card): string => {
  const name = normalizeName(card.name);
  return `${settings.dataPath}/encyclopedia/cardImages/set-${card.set}/${name}-${card.collector_number}.jpg`;
};

export const imagePathProvider: ImagePathProvider = {
  getSetSymbolPath,
  getCardImagePath,
};
