import { CardName } from '../logic/model';

type CurrentSelectionState = {
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

enum CurrentSelectionActionTypes {
    SelectCardName = "SELECT_CARD_NAME",
    SelectSet = "SELECT_SET",
    SelectVersion = "SELECT_VERSION",
    SelectCount = "SELECT_COUNT",
    Clear = "CLEAR_SELECTION",
}

type SelectCardNameAction = {
    type: CurrentSelectionActionTypes.SelectCardName,
    cardName: CardName
}

type SelectSetAction = {
    type: CurrentSelectionActionTypes.SelectSet,
    set: string
}

type SelectVersionAction = {
    type: CurrentSelectionActionTypes.SelectVersion,
    multiverseId: string
}

type SelectCountAction = {
    type: CurrentSelectionActionTypes.SelectCount,
    count: number
}

type ClearSelectionAction = {
    type: CurrentSelectionActionTypes.Clear
}

type CurrentSelectionActions =
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
    }
}
