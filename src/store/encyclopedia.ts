import { Card } from 'scryfall-api';
import { AsyncRequestStatus, NamedCard, toNamedCards } from '../logic/model';

export type EncyclopediaState = {
    isLoading: boolean,
    cards: Card[],
    namedCards: NamedCard[]
}

const encyclopediaDefaultState : EncyclopediaState = {
    isLoading: false,
    cards: [],
    namedCards: []
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
                namedCards: toNamedCards(action.cards)
            };
        default:
            return state;
    }
}

export function getEncyclopediaStatus(state: EncyclopediaState) : AsyncRequestStatus {
    if (state.isLoading) {
        return AsyncRequestStatus.Started;
    }

    if (state.cards.length === 0) {
        return AsyncRequestStatus.NotStarted;
    }

    return AsyncRequestStatus.Success;
}