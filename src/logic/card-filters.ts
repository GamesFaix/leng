import { BoxCard, CardFilter, normalizeName } from "./model";

export function filterCards(cards: BoxCard[], filter: CardFilter) : BoxCard[] {
    if (filter.nameQuery.length > 0) {
        const normalizedQuery = normalizeName(filter.nameQuery);
        cards = cards.filter(c => c.normalizedName.includes(normalizedQuery));
    }

    if (filter.sets.length > 0) {
        cards = cards.filter(c => filter.sets.find(s => c.setAbbrev === s.abbrev));
    }

    return cards;
}