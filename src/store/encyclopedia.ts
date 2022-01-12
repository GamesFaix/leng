import { Card } from 'scryfall-api';

type EncyclopediaState = {
    isLoading: boolean,
    cards: Card[]
}

const encyclopediaDefaultState : EncyclopediaState = {
    isLoading: false,
    cards: []
}

enum EncyclopediaActionTypes {
    LoadStart = 'LOAD_ENCYCLOPEDIA_START',
    LoadSuccess = 'LOAD_ENCYCLOPEDIA_SUCCESS'
}

type LoadEncyclopediaStartAction = {
    type: EncyclopediaActionTypes.LoadStart
}

type LoadEncyclopediaSuccessAction = {
    type: EncyclopediaActionTypes.LoadSuccess
    cards: Card[]
}

type EncyclopediaAction =
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
                cards: action.cards
            };
        default:
            return state;
    }
}
