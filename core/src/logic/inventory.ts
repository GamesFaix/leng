import {
  Box,
  BoxInfo,
  CardFinish,
  CardIndex,
  FileBox,
  getVersionLabel,
  Language,
  normalizeName,
} from "./model";

const getFinish = (finish: CardFinish, foil: boolean): CardFinish => {
  if (finish) return finish;
  return foil ? CardFinish.Foil : CardFinish.Normal;
};

export const fromFileBox = (fileBox: FileBox, cardIndex: CardIndex): Box => ({
  name: fileBox.name,
  lastModified: fileBox.lastModified,
  description: fileBox.description,
  cards: fileBox.cards.map((c) => {
    const match = cardIndex[c.scryfallId];
    return {
      name: c.name,
      setAbbrev: c.setAbbrev,
      setName: match?.set_name ?? "",
      scryfallId: c.scryfallId,
      lang: c.lang ?? Language.English,
      finish: getFinish(c.finish, c.foil),
      collectorsNumber: c.collectorsNumber ?? match.collector_number,
      count: c.count,
      color: match?.colors ?? [],
      colorIdentity: match?.color_identity ?? [],
      normalizedName: normalizeName(c.name),
      versionLabel: match ? getVersionLabel(match) : "",
      legalities: match.legalities,
    };
  }),
});

export const toFileBox = (box: Box): FileBox => ({
  name: box.name,
  lastModified: box.lastModified,
  description: box.description,
  cards: box.cards.map((c) => {
    return {
      name: c.name,
      setAbbrev: c.setAbbrev,
      scryfallId: c.scryfallId,
      lang: c.lang,
      finish: c.finish,
      foil: c.finish !== CardFinish.Normal,
      collectorsNumber: c.collectorsNumber,
      count: c.count,
    };
  }),
});

export const toBoxInfo = (box: FileBox): BoxInfo => ({
  name: box.name,
  lastModified: box.lastModified,
});

export type Inventory = {
  boxes: FileBox[];
};

export const defaultInventory: Inventory = {
  boxes: [],
};
