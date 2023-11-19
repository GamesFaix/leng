import { BoxCard, BoxState } from "../inventory";
import {
  CardGroupingOptions,
  CardSortFields,
  CardSortOptions,
  InventoryQuery,
  InventoryResult,
  InventoryResultKey,
} from "./types";
import { Card, normalizeCollectorsNumber } from "../encyclopedia";
import { groupBy, sortBy } from "lodash";
import { filterInventory } from "../filters";

const getResultKey = (
  card: BoxCard,
  options: CardGroupingOptions
): InventoryResultKey => {
  const setCode = options.combineSets ? null : card.setAbbrev;
  const collectorsNumber = options.combineArts
    ? null
    : normalizeCollectorsNumber(card.collectorsNumber);
  const finish = options.combineFinishes ? null : card.finish;
  const lang = options.combineLanguages ? null : card.lang;
  return {
    name: card.name,
    lang,
    finish,
    collectorsNumber,
    setCode,
  };
};

const getResultKeyString = (key: InventoryResultKey): string =>
  `${key.name}|${key.setCode}|${key.collectorsNumber}|${key.finish}|${key.lang}`;

const groupResults = (
  cards: BoxCard[],
  options: CardGroupingOptions
): InventoryResult[] => {
  const cardsWithKeys: [BoxCard, InventoryResultKey][] = cards.map((c) => [
    c,
    getResultKey(c, options),
  ]);

  const groups = groupBy(cardsWithKeys, (x) =>
    getResultKeyString(getResultKey(x[0], options))
  );
  return Object.keys(groups).map((key) => {
    const matches = groups[key];
    return {
      key: matches[0][1],
      cards: matches.map((x) => x[0]),
    };
  });
};

const getCollectorsNumberSortKey = (card: BoxCard): string => {
  const { color } = card;
  const colorCount = color.length;
  switch (colorCount) {
    case 0:
      if (card.type.includes("Land")) {
        return "8";
      } else {
        return "7";
      }

    case 1:
      switch (color[0]) {
        case "W":
          return "1";

        case "U":
          return "2";

        case "B":
          return "3";

        case "R":
          return "4";

        case "G":
          return "5";

        default:
          throw `Invalid color ${color[0]}`;
      }

    default:
      return "6";
  }
};

const sort = (
  results: InventoryResult[],
  options: CardSortOptions
): InventoryResult[] => {
  switch (options.field) {
    case CardSortFields.Name:
      return sortBy(results, (r) => r.key.name, options.direction);
    case CardSortFields.Number:
      return sortBy(results, (r) => r.key.collectorsNumber);
    case CardSortFields.ColorThenName:
      return sortBy(
        results,
        (r) => getCollectorsNumberSortKey(r.cards[0]),
        (r) => r.key.name
      );
    default:
      return results;
  }
};

export const search = (
  inventory: BoxState[],
  query: InventoryQuery,
  encyclopedia: Record<string, Card[]>,
  scryfallSearchResults: Card[]
): InventoryResult[] => {
  const filtered = filterInventory(
    inventory,
    query.filter,
    encyclopedia,
    scryfallSearchResults
  );
  const results = groupResults(filtered, query.grouping);
  return sort(results, query.sorting);
};
