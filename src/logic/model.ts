import { Card } from 'scryfall-api';
import { groupBy } from 'lodash';

export enum AsyncRequestStatus {
    NotStarted = 'NOT_STARTED',
    Started = 'STARTED',
    Success = 'SUCCESS',
    Failure = 'FAILURE'
}

export type CardName = {
    name: string,
    normalizedName: string,
    oracleId: string,
    cards: Card[]
}

export function normalizeName(name: string) : string {
    return name
        .toLowerCase()
        .replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ");
}

export function toCardNames(cards: Card[]) : CardName[] {
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
}