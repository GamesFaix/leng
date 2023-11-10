import { groupBy } from "lodash";
import { BoxCard } from "./types";

export const getKey = (card: BoxCard): string =>
  `${card.scryfallId}|${card.finish}|${card.lang}`;

export const areSame = (a: BoxCard, b: BoxCard): boolean =>
  getKey(a) === getKey(b);

export const combineDuplicates = (cards: BoxCard[]): BoxCard[] => {
  const groups = groupBy(cards, getKey);
  return Object.entries(groups).map((grp) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, cards] = grp;
    return {
      ...cards[0],
      count: cards.map((c) => c.count).reduce((a, b) => a + b, 0),
    };
  });
};

export const removeZeroes = (cards: BoxCard[]): BoxCard[] =>
  cards.filter((c) => c.count > 0);
