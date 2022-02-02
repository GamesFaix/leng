import { uniq } from 'lodash';
import { Card } from 'scryfall-api';
import { asyncRequest, AsyncRequest, AsyncRequestStatus, CardModule, SetInfo } from '../logic/model';

export type EncyclopediaState = {
    isLoading: boolean,
    cards: Card[],
    sets: SetInfo[],
    cardNames: string[],
}

const encyclopediaDefaultState : EncyclopediaState = {
    isLoading: false,
    cards: [],
    sets: [],
    cardNames: [],
}

export enum EncyclopediaActionTypes {
    Load = 'ENCYCLOPEDIA_LOAD'
}

export type EncyclopediaLoadAction = {
    type: EncyclopediaActionTypes.Load,
    value: AsyncRequest<void, Card[]>
}

export type EncyclopediaAction =
    EncyclopediaLoadAction;

export const encyclopediaActions = {
    loadStart() : EncyclopediaLoadAction {
        return {
            type: EncyclopediaActionTypes.Load,
            value: asyncRequest.started(undefined)
        };
    },
    loadSuccess(cards: Card[]) : EncyclopediaLoadAction {
        return {
            type: EncyclopediaActionTypes.Load,
            value: asyncRequest.success(cards)
        };
    },
    loadError(error: string) : EncyclopediaLoadAction {
        return {
            type: EncyclopediaActionTypes.Load,
            value: asyncRequest.failure(error)
        };
    }
}

const sortAndDeduplicate = (xs: string[])  => uniq(xs).sort();

export function encyclopediaReducer(state: EncyclopediaState = encyclopediaDefaultState, action: EncyclopediaAction) : EncyclopediaState {
    switch (action.type) {
        case EncyclopediaActionTypes.Load: {
            switch (action.value.status) {
                case AsyncRequestStatus.Started:
                    return {
                        ...state,
                        isLoading: true
                    };
                case AsyncRequestStatus.Success:
                    const cards = action.value.data;
                    return {
                        ...state,
                        isLoading: false,
                        cards,
                        sets: CardModule.toSetInfos(cards),
                        cardNames: sortAndDeduplicate(cards.map(c => c.name)),
                    };
                case AsyncRequestStatus.Failure:
                    return {
                        ...state,
                        isLoading: false
                    };
            }
        }
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