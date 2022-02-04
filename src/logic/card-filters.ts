import { BoxCard, CardFilter, normalizeName } from "./model";

export function filterCards(cards: BoxCard[], filter: CardFilter) : BoxCard[] {
    if (filter.nameQuery.length > 0) {
        const normalizedQuery = normalizeName(filter.nameQuery);
        cards = cards.filter(c => c.normalizedName.includes(normalizedQuery));
    }

    if (filter.setAbbrevs.length > 0) {
        cards = cards.filter(c => filter.setAbbrevs.find(s => c.setAbbrev === s));
    }

    return cards;
}