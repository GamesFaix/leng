import { Card } from 'scryfall-api';
import { groupBy, orderBy, uniqBy } from 'lodash';

export enum AsyncRequestStatus {
    NotStarted = 'NOT_STARTED',
    Started = 'STARTED',
    Success = 'SUCCESS',
    Failure = 'FAILURE'
}

/* Represents the group of all printings of a card with a given name */
export type NamedCard = {
    name: string,
    normalizedName: string,
    oracleId: string,
    cards: Card[]
}

/* Represents the number of copies of a given printing of a card in a box. */
export type BoxCard = {
    scryfallId: string,
    count: number,
    foil: boolean,

    // for user readability, can be looked up w/ scryfallId
    name: string,
    setAbbrev: string,
    version: string
}

/* A group of cards in a collection, saved in a single box file. (It could represent a binder, bulk box, deck, etc.) */
export type Box = {
    name: string,
    lastModified: Date,
    description: string,
    cards: BoxCard[]
}

/* Basic info about a box file on disk. */
export type BoxInfo = {
    name: string
    lastModified: Date
}

export type SetInfo = {
    name: string,
    normalizedName: string,
    abbrev: string
}

export function normalizeName(name: string) : string {
    return name
        .toLowerCase()
        .replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ");
}

export const CardModule = {
    toNamedCards(cards: Card[]) : NamedCard[] {
        const groups = groupBy(cards, c => normalizeName(c.name));

        return Object.entries(groups)
            .map(entry => {
                const [key, value] = entry;
                return {
                    normalizedName: key,
                    name: value[0].name,
                    oracleId: value[0].oracle_id,
                    cards: value
                };
            });
    },

    toSetInfo(card: Card) : SetInfo {
        return {
            name: card.set_name,
            abbrev: card.set,
            normalizedName: normalizeName(card.set_name)
        };
    },

    toSetInfos(cards: Card[]) : SetInfo[] {
        const oneCardPerSet = uniqBy(cards, c => c.set);
        const setInfos = oneCardPerSet.map(CardModule.toSetInfo);
        return orderBy(setInfos, s => s.name);
    }
}

export const NamedCardModule = {
    toSetInfos(namedCard: NamedCard): SetInfo[] {
        return namedCard.cards.map(CardModule.toSetInfo);
    }
}
