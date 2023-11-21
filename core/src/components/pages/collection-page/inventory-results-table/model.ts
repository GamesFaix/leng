import { InventoryResult } from "../../../../domain/inventory-search";
import { CardFinish, Language } from "../../../../domain/encyclopedia";
import { sumBy, uniq } from "lodash";
import { BoxCard } from "../../../../domain/inventory";

export type InventoryResultRowModel = {
  name: string;
  count: number;

  // Fields that can be "multiple"
  version: string | null;
  setAbbrev: string | null;
  lang: Language | null;
  finish: CardFinish | null;
  cards: BoxCard[];
};

const uniqueOrNull = <T, Key>(xs: T[], selector: (x: T) => Key) => {
  const unique = uniq(xs.map(selector));
  return unique.length > 1 ? null : unique[0];
};

export const toRowModel = (
  result: InventoryResult
): InventoryResultRowModel => {
  return {
    name: result.key.name,
    count: sumBy(result.cards, (c) => c.count),
    version: uniqueOrNull(result.cards, (c) => c.collectorsNumber),
    setAbbrev: uniqueOrNull(result.cards, (c) => c.setAbbrev),
    lang: uniqueOrNull(result.cards, (c) => c.lang),
    finish: uniqueOrNull(result.cards, (c) => c.finish),
    cards: result.cards
  };
};
