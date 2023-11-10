import { Dictionary, groupBy, chunk, orderBy } from "lodash";
import { Set } from "../encyclopedia";
import { innerJoin } from "../array";
import { BoxCard } from "../inventory";

type SetWithCards = {
  set: Set;
  cards: BoxCard[];
};

type SetWithCardGroups = {
  set: Set;
  cardGroups: BoxCard[][];
};

enum SetType {
  Normal,
  Tokens,
  Promos,
  ArtSeries,
}

function getSetType(setName: string): SetType {
  if (setName.endsWith(" Tokens")) return SetType.Tokens;
  if (setName.endsWith(" Promos")) return SetType.Promos;
  if (setName.endsWith(" Art Series")) return SetType.ArtSeries;
  return SetType.Normal;
}

function getSetBase(setName: string): string {
  if (setName.endsWith(" Tokens") || setName.endsWith(" Promos")) {
    return setName.substring(0, setName.length - 7);
  }
  if (setName.endsWith(" Art Series")) {
    return setName.substring(0, setName.length - 11);
  }

  return setName;
}

export function normalizeCollectorsNumber(x: string) {
  const pattern = /([a-zA-Z]*)(\d+)(.*)/;
  const match = pattern.exec(x);
  if (!match) {
    throw new Error("Invalid collector's number");
  }
  const prefix = match[1];
  const num = match[2];
  const msc = match[3];
  return `${prefix.padEnd(1, "_")}|${num
    .toString()
    .padStart(4, "0")}|${msc.replace("★", "")}`;
}

function compareCollectorsNumbers(a: string, b: string): number {
  const normalizedA = normalizeCollectorsNumber(a);
  const normalizedB = normalizeCollectorsNumber(b);
  return normalizedA.localeCompare(normalizedB);
}

export function organizePages(
  cards: BoxCard[],
  sets: Set[],
  sortSets?: (a: Set, b: Set) => number
): BoxCard[][][] {
  // An array of pages, which are arrays of card groups, which are arrays of foil/non-foil versions of the same card
  const groupedBySet: Dictionary<BoxCard[]> = groupBy(
    cards,
    (c) => c.setAbbrev
  );

  const setsWithCards: SetWithCards[] = innerJoin(
    sets,
    Object.entries(groupedBySet),
    (set) => set.code,
    (grp) => grp[0],
    (set, grp) => {
      return { set, cards: grp[1] };
    }
  );

  const setsWithSortedCardGroups: SetWithCardGroups[] = setsWithCards.map(
    (x) => {
      const grouped =
        x.set.code === "8ed"
          ? groupBy(x.cards, (c) => c.name) // 8ED has this weird issue where foils have a star character in the collectors number
          : groupBy(x.cards, (c) => c.scryfallId);

      const sorted = Object.values(grouped).sort((a, b) =>
        compareCollectorsNumbers(a[0].collectorsNumber, b[0].collectorsNumber)
      );
      return {
        set: x.set,
        cardGroups: sorted,
      };
    }
  );

  const groupSetsWithCardsBySetBase: Dictionary<SetWithCardGroups[]> = groupBy(
    setsWithSortedCardGroups,
    (x) => getSetBase(x.set.name)
  );

  const relatedSetsWithCardGroups = Object.values(
    groupSetsWithCardsBySetBase
  ).map((grp) => {
    const withTypes = grp.map((x) => {
      return { ...x, type: getSetType(x.set.name) };
    });
    const baseSet = withTypes.find((x) => x.type === SetType.Normal);
    const tokenSet = withTypes.find((x) => x.type === SetType.Tokens);
    const promosSet = withTypes.find((x) => x.type === SetType.Promos);
    const artSeriesSet = withTypes.find((x) => x.type === SetType.ArtSeries);

    const set = baseSet?.set ?? grp[0].set; // Some promo sets don't have a base set
    const cardGroups = (promosSet?.cardGroups ?? [])
      .concat(baseSet?.cardGroups ?? [])
      .concat(tokenSet?.cardGroups ?? [])
      .concat(artSeriesSet?.cardGroups ?? []);

    return { set, cardGroups };
  });

  const setsWithPages = relatedSetsWithCardGroups.map((x) => {
    return { set: x.set, pages: chunk(x.cardGroups, 9) };
  });

  const sortedSets = sortSets
    ? setsWithPages.sort((a, b) => sortSets(a.set, b.set))
    : orderBy(setsWithPages, (x) => x.set.released_at);

  const pages = sortedSets
    .map((x) => x.pages)
    .reduce((a, b) => a.concat(b), []);

  return pages;
}
