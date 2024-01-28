import { CardFinish, CardIndex, Language, getVersionLabel } from "../encyclopedia";
import { Box, BoxInfo } from "../inventory";
import { normalizeName } from "../names";
import { FileBox } from "./types";
import { choose } from "../array";

const getFinish = (finish: CardFinish, foil: boolean): CardFinish => {
  if (finish) return finish;
  return foil ? CardFinish.Foil : CardFinish.Normal;
};

export const fromFileBox = (fileBox: FileBox, cardIndex: CardIndex): Box => {
  const cards = choose(fileBox.cards, (c) => {
    const match = cardIndex[c.scryfallId];
    if (!match) {
      console.warn(`Inventory card missing in Scryfall data. ID:${c.scryfallId} (${c.name} - ${c.setAbbrev})`);
      return null;
    }

    return {
      name: c.name,
      setAbbrev: c.setAbbrev,
      setName: match?.set_name ?? "",
      scryfallId: c.scryfallId,
      lang: c.lang ?? Language.English,
      finish: getFinish(c.finish, c.foil),
      collectorsNumber: c.collectorsNumber ?? match.num,
      count: c.count,
      color: match?.colors ?? [],
      colorIdentity: match?.color_identity ?? [],
      normalizedName: normalizeName(c.name),
      versionLabel: match ? getVersionLabel(match) : "",
      legalities: match.legalities,
      type: match.type,
    };
  });

  return {
    name: fileBox.name,
    lastModified: fileBox.lastModified,
    description: fileBox.description,
    cards,
  };
};

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
