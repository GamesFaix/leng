import { CardName } from '../logic/model';

export type CurrentSelectionState = {
    cardName: CardName | null,
    setAbbrev: string | null,
    count: number | null,
    scryfallId: string | null,
    isFoil: boolean | null
}

const currentSelectionDefaultState : CurrentSelectionState = {
    cardName: null,
    setAbbrev: null,
    count: null,
    scryfallId: null,
    isFoil: null
};

// TODO: Need separate selection for isFoil flag

enum CurrentSelectionActionTypes {
    SelectCardName = "SELECT_CARD_NAME",
    SelectSetAbbrev = "SELECT_SET_ABBREV",
    SelectVersion = "SELECT_VERSION",
    SelectCount = "SELECT_COUNT",
    Clear = "CLEAR_SELECTION",
}

type SelectCardNameAction = {
    type: CurrentSelectionActionTypes.SelectCardName,
    cardName: CardName
}

type SelectSetAbbrevAction = {
    type: CurrentSelectionActionTypes.SelectSetAbbrev,
    setAbbrev: string
}

type SelectVersionAction = {
    type: CurrentSelectionActionTypes.SelectVersion,
    scryfallId: string
    isFoil: boolean
}

type SelectCountAction = {
    type: CurrentSelectionActionTypes.SelectCount,
    count: number
}

type ClearSelectionAction = {
    type: CurrentSelectionActionTypes.Clear
}

export type CurrentSelectionActions =
    SelectCardNameAction |
    SelectSetAbbrevAction |
    SelectVersionAction |
    SelectCountAction |
    ClearSelectionAction

export const currentSelectionActions = {
    selectCardName(cardName: CardName)  : SelectCardNameAction {
        return {
            type: CurrentSelectionActionTypes.SelectCardName,
            cardName
        };
    },
    selectSetAbbrev(setAbbrev: string) : SelectSetAbbrevAction {
        return {
            type: CurrentSelectionActionTypes.SelectSetAbbrev,
            setAbbrev
        };
    },
    selectVersion(scryfallId: string, isFoil: boolean) : SelectVersionAction {
        return {
            type: CurrentSelectionActionTypes.SelectVersion,
            scryfallId: scryfallId,
            isFoil: isFoil
        };
    },
    selectCount(count: number): SelectCountAction {
        return {
            type: CurrentSelectionActionTypes.SelectCount,
            count
        };
    },
    clear() : ClearSelectionAction {
        return {
            type: CurrentSelectionActionTypes.Clear
        };
    }
}

export function currentSelectionReducer(state: CurrentSelectionState = currentSelectionDefaultState, action: CurrentSelectionActions) : CurrentSelectionState {
    switch (action.type) {
        case CurrentSelectionActionTypes.SelectCardName:
            return {
                ...state,
                cardName: action.cardName
            };

        case CurrentSelectionActionTypes.SelectSetAbbrev:
            return {
                ...state,
                setAbbrev: action.setAbbrev
            };

        case CurrentSelectionActionTypes.SelectVersion:
            return {
                ...state,
                scryfallId: action.scryfallId,
                isFoil: action.isFoil
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
