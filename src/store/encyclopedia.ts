import { Card } from 'scryfall-api';
import { CardName, toCardNames } from '../logic/model';

export type EncyclopediaState = {
    isLoading: boolean,
    cards: Card[],
    cardNames: CardName[]
}

const encyclopediaDefaultState : EncyclopediaState = {
    isLoading: false,
    cards: [],
    cardNames: []
}

export enum EncyclopediaActionTypes {
    LoadStart = 'LOAD_ENCYCLOPEDIA_START',
    LoadSuccess = 'LOAD_ENCYCLOPEDIA_SUCCESS'
}

export type LoadEncyclopediaStartAction = {
    type: EncyclopediaActionTypes.LoadStart
}

export type LoadEncyclopediaSuccessAction = {
    type: EncyclopediaActionTypes.LoadSuccess
    cards: Card[]
}

export type EncyclopediaAction =
    LoadEncyclopediaStartAction |
    LoadEncyclopediaSuccessAction

export function encyclopediaReducer(state: EncyclopediaState = encyclopediaDefaultState, action: EncyclopediaAction) : EncyclopediaState {
    switch (action.type) {
        case EncyclopediaActionTypes.LoadStart:
            return {
                ...state,
                isLoading: true
            };
        case EncyclopediaActionTypes.LoadSuccess:
            return {
                ...state,
                isLoading: false,
                cards: action.cards,
                cardNames: toCardNames(action.cards)
            };
        default:
            return state;
    }
}
