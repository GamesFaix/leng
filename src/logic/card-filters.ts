import { difference, intersection, uniq } from "lodash";
import { Color } from "scryfall-api";
import { ColorFilterRule } from "../components/collection-page/color-rule-selector";
import { ColorFilter } from "../components/collection-page/color-selector";
import { BoxState } from "../store/inventory";
import { BoxCard, BoxCardModule, CardFilter, normalizeName } from "./model";

function containsAny(cardColors: Color[], filterColors: ColorFilter[]) {
    if (cardColors.length === 0 && filterColors.includes('C')) {
        return true;
    }

    return intersection(cardColors, filterColors).length > 0;
}

function containsAll(cardColors: Color[], filterColors: ColorFilter[]) {
    if (cardColors.length === 0 && filterColors.length === 1 && filterColors[0] === 'C') {
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
    if (cardColors.length === 0 && filterColors.length === 1 && filterColors[0] === 'C') {
        return true;
    }

    for (const fc of filterColors) {
        if (!cardColors.includes(fc as any)) {
            return false;
        }
    }

    return cardColors.length === filterColors.length;
}

function filterCardsByColor(cards: BoxCard[], colors: ColorFilter[], rule: ColorFilterRule) : BoxCard[] {
    switch (rule) {
        case ColorFilterRule.ContainsAny:
            return cards.filter(c => containsAny(c.color ?? [], colors));
        case ColorFilterRule.ContainsAll:
            return cards.filter(c => containsAll(c.color ?? [], colors));
        case ColorFilterRule.ContainsOnly:
            return cards.filter(c => containsOnly(c.color ?? [], colors));
        case ColorFilterRule.IsExactly:
            return cards.filter(c => isColorExactly(c.color ?? [], colors));
        case ColorFilterRule.IdentityContainsAny:
            return cards.filter(c => containsAny(c.colorIdentity ?? [], colors));
        case ColorFilterRule.IdentityContainsAll:
            return cards.filter(c => containsAll(c.colorIdentity ?? [], colors));
        case ColorFilterRule.IdentityContainsOnly:
            return cards.filter(c => containsOnly(c.colorIdentity ?? [], colors));
        case ColorFilterRule.IdentityIsExactly:
            return cards.filter(c => isColorExactly(c.colorIdentity ?? [], colors));
    }
}

function filterCards(cards: BoxCard[], filter: CardFilter) : BoxCard[] {
    if (filter.nameQuery.length > 0) {
        const normalizedQuery = normalizeName(filter.nameQuery);
        cards = cards.filter(c => c.normalizedName.includes(normalizedQuery));
    }

    if (filter.setAbbrevs.length > 0) {
        cards = cards.filter(c => filter.setAbbrevs.find(s => c.setAbbrev === s));
    }

    if (filter.colors.length > 0) {
        cards = filterCardsByColor(cards, filter.colors, filter.colorRule);
    }

    if (filter.format !== null) {
        const key = filter.format as any;
        cards = cards.filter(c => {
            const legality = c.legalities[key];
            return legality === 'legal' || legality === 'restricted';
        });
    }

    return cards;
}

function combineBoxes(boxes: BoxState[], filter: CardFilter) : BoxCard[] {
    const includeBoxes = filter.fromBoxes.length > 0
        ? boxes.filter(b => filter.fromBoxes.includes(b.name))
        : boxes;

    const exceptBoxes = filter.exceptBoxes.length > 0
        ? boxes.filter(b => filter.exceptBoxes.includes(b.name))
        : [];

    const includeCards = BoxCardModule.combineDuplicates(getCardsFromBoxes(includeBoxes));
    const exceptKeys = uniq(getCardsFromBoxes(exceptBoxes).map(BoxCardModule.getKey));

    return includeCards.filter(c => !exceptKeys.includes(BoxCardModule.getKey(c)));
}

export function getCardsFromBoxes(boxes: BoxState[]) : BoxCard[] {
    return boxes.map(b => b.cards ?? []).reduce((a, b) => a.concat(b), []);
}

export function getCards(inventory: BoxState[], filter: CardFilter) : BoxCard[] {
    let cards = combineBoxes(inventory, filter);
    cards = BoxCardModule.combineDuplicates(cards);
    cards = filterCards(cards, filter);
    return cards;
}