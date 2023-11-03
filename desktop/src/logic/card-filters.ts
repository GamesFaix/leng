import { difference, intersection, uniq } from "lodash";
import { Card, Color } from "scryfall-api";
import { ColorFilterRule } from "../components/collection-page/color-rule-selector";
import { ColorFilter } from "../components/collection-page/color-selector";
import { basicLandNames } from "../components/reports-page/model";
import { BoxState } from "../store/inventory";
import { FormatType } from "leng-core/src/logic/formats";
import { BoxCard, BoxCardModule, CardFilter, normalizeName } from "./model";

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
  if (filter.nameQuery.length > 0) {
    const normalizedQuery = normalizeName(filter.nameQuery);
    cards = cards.filter((c) => c.normalizedName.includes(normalizedQuery));
  }

  if (filter.setAbbrevs.length > 0) {
    cards = cards.filter((c) =>
      filter.setAbbrevs.find((s) => c.setAbbrev === s)
    );
  }

  if (filter.colors.length > 0) {
    cards = filterCardsByColor(cards, filter.colors, filter.colorRule);
  }

  if (filter.format !== null) {
    if (filter.format.type === FormatType.Standard) {
      const key = filter.format.name;
      cards = cards.filter((c) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const legality = c.legalities[key as any];
        return legality === "legal" || legality === "restricted";
      });
    }
    if (filter.format.type === FormatType.Custom) {
      const legalCardNames = uniq(
        filter.format.setCodes
          .map((set) => allCardsBySet[set].map((c) => c.name))
          .reduce((a, b) => a.concat(b))
      );
      cards = cards.filter((c) => legalCardNames.includes(c.name));
    }

    // Don't return basic lands, it's overwhelming noise in formats with small card pools
    cards = cards.filter((x) => !basicLandNames.includes(x.name));
  }

  if (filter.scryfallQuery.length > 0) {
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

  const includeCards = BoxCardModule.combineDuplicates(
    getCardsFromBoxes(includeBoxes)
  );
  const exceptKeys = uniq(
    getCardsFromBoxes(exceptBoxes).map(BoxCardModule.getKey)
  );

  return includeCards.filter(
    (c) => !exceptKeys.includes(BoxCardModule.getKey(c))
  );
}

export function getCardsFromBoxes(boxes: BoxState[]): BoxCard[] {
  return boxes.map((b) => b.cards ?? []).reduce((a, b) => a.concat(b), []);
}

export function getCards(
  inventory: BoxState[],
  filter: CardFilter,
  allCardsBySet: Record<string, Card[]>,
  searchResults: Card[]
): BoxCard[] {
  let cards = combineBoxes(inventory, filter);
  cards = BoxCardModule.combineDuplicates(cards);
  cards = filterCards(cards, filter, allCardsBySet, searchResults);
  return cards;
}
