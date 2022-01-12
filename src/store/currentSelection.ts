import { CardName } from '../logic/model';

export type CurrentSelectionState = {
    cardName: CardName | null,
    set: string | null,
    count: number | null,
    multiverseId: string | null
}

const currentSelectionDefaultState : CurrentSelectionState = {
    cardName: null,
    set: null,
    count: null,
    multiverseId: null
};

export enum CurrentSelectionActionTypes {
    SelectCardName = "SELECT_CARD_NAME",
    SelectSet = "SELECT_SET",
    SelectVersion = "SELECT_VERSION",
    SelectCount = "SELECT_COUNT",
    Clear = "CLEAR_SELECTION",
}

export type SelectCardNameAction = {
    type: CurrentSelectionActionTypes.SelectCardName,
    cardName: CardName
}

export type SelectSetAction = {
    type: CurrentSelectionActionTypes.SelectSet,
    set: string
}

export type SelectVersionAction = {
    type: CurrentSelectionActionTypes.SelectVersion,
    multiverseId: string
}

export type SelectCountAction = {
    type: CurrentSelectionActionTypes.SelectCount,
    count: number
}

export type ClearSelectionAction = {
    type: CurrentSelectionActionTypes.Clear
}

export type CurrentSelectionActions =
    SelectCardNameAction |
    SelectSetAction |
    SelectVersionAction |
    SelectCountAction |
    ClearSelectionAction

export function currentSelectionReducer(state: CurrentSelectionState = currentSelectionDefaultState, action: CurrentSelectionActions) : CurrentSelectionState {
    switch (action.type) {
        case CurrentSelectionActionTypes.SelectCardName:
            return {
                ...state,
                cardName: action.cardName
            };

        case CurrentSelectionActionTypes.SelectSet:
            return {
                ...state,
                set: action.set
            };

        case CurrentSelectionActionTypes.SelectVersion:
            return {
                ...state,
                multiverseId: action.multiverseId
            };

        case CurrentSelectionActionTypes.SelectCount:
            return {
                ...state,
                count: action.count
            };

        case CurrentSelectionActionTypes.Clear:
            return currentSelectionDefaultState;

        default:
            return state;
    }
}
