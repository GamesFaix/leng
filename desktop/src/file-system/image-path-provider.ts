import { ImagePathProvider } from "leng-core/src/domain/interfaces";
import { Card, Set } from "leng-core/src/domain/encyclopedia";
import { AppSettings } from "leng-core/src/domain/config";
import { normalizeName } from "leng-core/src/domain/names";

const getSetSymbolPath = (settings: AppSettings, set: Set): string =>
  // Need "set-" prefix to avoid naming Conflux icon "con", which is a reserved name in Windows
  `${settings.dataPath}/encyclopedia/setSymbols/set-${set.code}.svg`;

const getCardImagePath = (settings: AppSettings, card: Card): string => {
  const name = normalizeName(card.name);
  return `${settings.dataPath}/encyclopedia/cardImages/set-${card.set}/${name}-${card.num}.jpg`;
};

export const imagePathProvider: ImagePathProvider = {
  getSetSymbolPath,
  getCardImagePath,
};
