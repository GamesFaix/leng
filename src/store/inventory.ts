import { orderBy } from "lodash";
import { Box, BoxCard, BoxInfo } from "../logic/model";

export function areSameCard(a: BoxCard, b: BoxCard) : boolean {
    return a.scryfallId === b.scryfallId &&
        a.foil === b.foil &&
        a.lang === b.lang;
}

export type BoxState = {
    name: string,
    lastModified: Date,

    // Deferred loading because file must be opened and deserialized
    description: string | null,
    cards: BoxCard[] | null
}

export type InventoryState = {
    loading: boolean,
    boxes: BoxState[] | null,
}

const inventoryDefaultState : InventoryState = {
    boxes: null,
    loading: false
};

export enum InventoryActionTypes {
    LoadBoxInfosStart = 'LOAD_BOX_INFOS_START',
    LoadBoxInfosSuccess = 'LOAD_BOX_INFOS_SUCCESS',
    LoadBoxStart = 'LOAD_BOX_START',
    LoadBoxSuccess = 'LOAD_BOX_SUCCESS',
    CreateBox = 'CREATE_BOX',
    DeleteBox = 'DELETE_BOX',
    AddCard = 'ADD_CARD',
    ChangeCount = 'CHANGE_COUNT',
    RemoveCard = 'REMOVE_CARD',
    SaveBoxStart = 'SAVE_BOX_START',
    SaveBoxSuccess = 'SAVE_BOX_SUCCESS'
}

export type LoadBoxInfosStartAction = {
    type: InventoryActionTypes.LoadBoxInfosStart
}

export type LoadBoxInfosSuccessAction = {
    type: InventoryActionTypes.LoadBoxInfosSuccess,
    boxes: BoxInfo[]
}

export type LoadBoxStartAction = {
    type: InventoryActionTypes.LoadBoxStart,
    name: string
}

export type LoadBoxSuccessAction = {
    type: InventoryActionTypes.LoadBoxSuccess,
    box: Box
}

export type AddCardAction = {
    type: InventoryActionTypes.AddCard,
    boxInfo: BoxInfo,
    card: BoxCard
}

export type ChangeCountAction = {
    type: InventoryActionTypes.ChangeCount,
    boxInfo: BoxInfo,
    card: BoxCard
}

export type RemoveCardAction = {
    type: InventoryActionTypes.RemoveCard,
    boxInfo: BoxInfo,
    card: BoxCard
}

export type SaveBoxStartAction = {
    type: InventoryActionTypes.SaveBoxStart,
    box: Box
}

export type SaveBoxSuccessAction = {
    type: InventoryActionTypes.SaveBoxSuccess,
    box: Box
}

export type CreateBoxAction = {
    type: InventoryActionTypes.CreateBox,
    boxInfo: BoxInfo
}

export type DeleteBoxAction = {
    type: InventoryActionTypes.DeleteBox,
    boxInfo: BoxInfo
}

export type InventoryAction =
    LoadBoxInfosStartAction |
    LoadBoxInfosSuccessAction |
    LoadBoxStartAction |
    LoadBoxSuccessAction |
    AddCardAction |
    ChangeCountAction |
    RemoveCardAction |
    SaveBoxStartAction |
    SaveBoxSuccessAction |
    CreateBoxAction |
    DeleteBoxAction

export function inventoryReducer(state: InventoryState = inventoryDefaultState, action: InventoryAction): InventoryState {
    switch (action.type) {
        case InventoryActionTypes.LoadBoxInfosStart:
            return { ...state, loading: true };

        case InventoryActionTypes.LoadBoxInfosSuccess: {
            return {
                ...state,
                loading: false,
                boxes: action.boxes.map(b => {
                    return {
                        name: b.name,
                        lastModified: b.lastModified,
                        description: null,
                        cards: null
                    };
                 })
            };
        }
        case InventoryActionTypes.LoadBoxStart:
            return { ...state, loading: true };

        case InventoryActionTypes.LoadBoxSuccess: {
            const boxes = state.boxes?.map(b => {
                if (b.name === action.box.name) {
                    return { ...action.box };
                } else {
                    return b;
                }
            }) ?? null;

            return { ...state, boxes };
        }
        case InventoryActionTypes.AddCard: {
            const boxes = state.boxes?.map(b => {
                if (b.name === action.boxInfo.name) {
                    const cards = b.cards?.map(c => {
                        if (areSameCard(c, action.card)){
                            return {
                                ...c,
                                count: c.count + action.card.count
                            };
                        } else {
                            return c;
                        }
                    }) ?? null;
                    if (cards) {
                        cards.push(action.card);
                    }

                    return { ...b, cards };
                } else {
                    return b;
                }
            }) ?? null;

            return { ...state, boxes };
        }
        case InventoryActionTypes.ChangeCount: {
            const boxes = state.boxes?.map(b => {
                if (b.name === action.boxInfo.name) {
                    const cards = b.cards?.map(c => {
                        if (areSameCard(c, action.card)){
                            return {
                                ...c,
                                count: action.card.count
                            };
                        } else {
                            return c;
                        }
                    }) ?? null;

                    return { ...b, cards };
                } else {
                    return b;
                }
            }) ?? null;

            return { ...state, boxes };
        }
        case InventoryActionTypes.RemoveCard: {
            const boxes = state.boxes?.map(b => {
                if (b.name === action.boxInfo.name) {
                    const cards = b.cards?.filter(c => !areSameCard(c, action.card)) ?? null;
                    return { ...b, cards };
                } else {
                    return b;
                }
            }) ?? null;

            return { ...state, boxes };
        }
        case InventoryActionTypes.SaveBoxStart:
            return { ...state, loading: true };

        case InventoryActionTypes.SaveBoxSuccess: {
            const boxes = state.boxes?.map(b => {
                if (b.name === action.box.name) {
                    return action.box;
                } else {
                    return b;
                }
            }) ?? null;
            return { ...state, boxes };
        }
        case InventoryActionTypes.CreateBox: {
            const newBox : BoxState = {
                name: action.boxInfo.name,
                lastModified: action.boxInfo.lastModified,
                cards: [],
                description: ''
            };
            const boxes = state.boxes ? orderBy([...state.boxes, newBox ], b => b.name) : null;
            return { ...state, boxes };
        }
        case InventoryActionTypes.DeleteBox: {
            const boxes = state.boxes?.filter(b => b.name !== action.boxInfo.name) ?? null;
            return { ...state, boxes };
        }
        default:
            return state;
    }
}
