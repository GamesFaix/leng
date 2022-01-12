export type InventoryCard = {
    multiverseId: string,
    count: number
}

export type InventoryState = {
    cards: InventoryCard[]
}

const inventoryDefaultState : InventoryState = {
    cards: []
}

export enum InventoryActionTypes {
    AddCard = 'ADD_CARD',
    ChangeCount = 'CHANGE_COUNT',
    RemoveCard = 'REMOVE_CARD'
}

export type InventoryAddCardAction = {
    type: InventoryActionTypes.AddCard,
    card: InventoryCard
}

export type InventoryChangeCountAction = {
    type: InventoryActionTypes.ChangeCount,
    card: InventoryCard
}

export type InventoryRemoveCardAction = {
    type: InventoryActionTypes.RemoveCard,
    multiverseId: string
}

export type InventoryAction =
    InventoryAddCardAction |
    InventoryChangeCountAction |
    InventoryRemoveCardAction

export function inventoryReducer(state: InventoryState = inventoryDefaultState, action: InventoryAction): InventoryState {
    switch (action.type) {
        case InventoryActionTypes.AddCard:
            return {
                ...state,
                cards: state.cards.map(c => {
                    if (c.multiverseId === action.card.multiverseId) {
                        return { ...c, count: c.count + action.card.count };
                    } else {
                        return c;
                    }
                })
            };

        case InventoryActionTypes.ChangeCount:
            return {
                ...state,
                cards: state.cards.map(c => {
                    if (c.multiverseId === action.card.multiverseId) {
                        return { ...c, count: action.card.count };
                    } else {
                        return c;
                    }
                })
            };

        case InventoryActionTypes.RemoveCard:
            return {
                ...state,
                cards: state.cards.filter(c => c.multiverseId !== action.multiverseId)
            };

        default:
            return state;
    }
}
