import { difference, intersection, uniq } from "lodash";
import { CardFilter, ColorFilter, ColorFilterRule } from "./types";
import { BoxCard, BoxState, combineDuplicates, getKey } from "../inventory";
import { normalizeName } from "../names";
import { FormatType } from "../formats";
import { Card, Color, basicLandNames } from "../encyclopedia";

function containsAny(cardColors: Color[], filterColors: ColorFilter[]) {
  if (cardColors.length === 0 && filterColors.includes("C")) {
    return true;
  }

  return intersection(cardColors, filterColors).length > 0;
}

function containsAll(cardColors: Color[], filterColors: ColorFilter[]) {
  if (
    cardColors.length === 0 &&
    filterColors.length === 1 &&
    filterColors[0] === "C"
  ) {
    return true;
  }

  return intersection(cardColors, filterColors).length === filterColors.length;
}

function containsOnly(cardColors: Color[], filterColors: ColorFilter[]) {
  if (cardColors.length === 0) {
    return true;
  }

  return difference(cardColors, filterColors).length === 0;
}

function isColorExactly(cardColors: Color[], filterColors: ColorFilter[]) {
  if (
    cardColors.length === 0 &&
    filterColors.length === 1 &&
    filterColors[0] === "C"
  ) {
    return true;
  }

  for (const fc of filterColors) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!cardColors.includes(fc as any)) {
      return false;
    }
  }

  return cardColors.length === filterColors.length;
}

function filterCardsByColor(
  cards: BoxCard[],
  colors: ColorFilter[],
  rule: ColorFilterRule
): BoxCard[] {
  switch (rule) {
    case ColorFilterRule.ContainsAny:
      return cards.filter((c) => containsAny(c.color ?? [], colors));
    case ColorFilterRule.ContainsAll:
      return cards.filter((c) => containsAll(c.color ?? [], colors));
    case ColorFilterRule.ContainsOnly:
      return cards.filter((c) => containsOnly(c.color ?? [], colors));
    case ColorFilterRule.IsExactly:
      return cards.filter((c) => isColorExactly(c.color ?? [], colors));
    case ColorFilterRule.IdentityContainsAny:
      return cards.filter((c) => containsAny(c.colorIdentity ?? [], colors));
    case ColorFilterRule.IdentityContainsAll:
      return cards.filter((c) => containsAll(c.colorIdentity ?? [], colors));
    case ColorFilterRule.IdentityContainsOnly:
      return cards.filter((c) => containsOnly(c.colorIdentity ?? [], colors));
    case ColorFilterRule.IdentityIsExactly:
      return cards.filter((c) => isColorExactly(c.colorIdentity ?? [], colors));
  }
}

function filterCards(
  cards: BoxCard[],
  filter: CardFilter,
  allCardsBySet: Record<string, Card[]>,
  searchResults: Card[]
): BoxCard[] {
  const { nameQuery, colors, colorRule, format, setAbbrevs, scryfallQuery } =
    filter;

  if (nameQuery.length > 0) {
    const normalizedQuery = normalizeName(nameQuery);
    cards = cards.filter((c) => c.normalizedName.includes(normalizedQuery));
  }

  if (setAbbrevs.length > 0) {
    cards = cards.filter((c) => setAbbrevs.find((s) => c.setAbbrev === s));
  }

  if (colors.length > 0) {
    cards = filterCardsByColor(cards, colors, colorRule);
  }

  if (format !== null) {
    if (format.type === FormatType.Scryfall) {
      const key = format.scryfallKey;
      cards = cards.filter((c) => {
        const legality = c.legalities[key];
        return legality === "legal" || legality === "restricted";
      });
    }
    if (format.type === FormatType.Custom) {
      const legalCardNames = uniq(
        format.setCodes
          .map((set) => {
            try {
              return allCardsBySet[set].map((c) => c.name);
            } catch (ex) {
              console.error(
                `No cards found from set ${set} in format ${format.name}. Double check set code.`
              );
              return [];
            }
          })
          .reduce((a, b) => a.concat(b))
      );
      cards = cards.filter((c) => legalCardNames.includes(c.name));
    }

    // Don't return basic lands, it's overwhelming noise in formats with small card pools
    cards = cards.filter((x) => !basicLandNames.includes(x.name));
  }

  if (scryfallQuery.length > 0) {
    cards = cards.filter((c) =>
      searchResults.find((result) => c.scryfallId === result.id)
    );
  }

  return cards;
}

function combineBoxes(boxes: BoxState[], filter: CardFilter): BoxCard[] {
  const includeBoxes =
    filter.fromBoxes.length > 0
      ? boxes.filter((b) => filter.fromBoxes.includes(b.name))
      : boxes;

  const exceptBoxes =
    filter.exceptBoxes.length > 0
      ? boxes.filter((b) => filter.exceptBoxes.includes(b.name))
      : [];

  const includeCards = combineDuplicates(getCardsFromBoxes(includeBoxes));
  const exceptKeys = uniq(getCardsFromBoxes(exceptBoxes).map(getKey));

  return includeCards.filter((c) => !exceptKeys.includes(getKey(c)));
}

export function getCardsFromBoxes(boxes: BoxState[]): BoxCard[] {
  return boxes.map((b) => b.cards ?? []).reduce((a, b) => a.concat(b), []);
}

export function filterInventory(
  inventory: BoxState[],
  filter: CardFilter,
  allCardsBySet: Record<string, Card[]>,
  searchResults: Card[]
): BoxCard[] {
  let cards = combineBoxes(inventory, filter);
  cards = combineDuplicates(cards);
  cards = filterCards(cards, filter, allCardsBySet, searchResults);
  return cards;
}
