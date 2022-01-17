import { Card } from 'scryfall-api';
import { AsyncRequestStatus, CardModule, NamedCard, SetInfo } from '../logic/model';

export type EncyclopediaState = {
    isLoading: boolean,
    cards: Card[],
    namedCards: NamedCard[],
    sets: SetInfo[]
}

const encyclopediaDefaultState : EncyclopediaState = {
    isLoading: false,
    cards: [],
    namedCards: [],
    sets: []
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
                namedCards: CardModule.toNamedCards(action.cards),
                sets: CardModule.toSetInfos(action.cards)
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