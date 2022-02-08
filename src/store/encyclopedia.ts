import { uniq } from 'lodash';
import { Card } from 'scryfall-api';
import { asyncRequest, AsyncRequest, AsyncRequestStatus, CardIndex, CardModule, SetInfo } from '../logic/model';

export type EncyclopediaState = {
    isLoading: boolean,
    cards: Card[],
    sets: SetInfo[],
    cardNames: string[],
    cardIndex: CardIndex,
    cachedCardImageIds: string[]
}

const encyclopediaDefaultState : EncyclopediaState = {
    isLoading: false,
    cards: [],
    sets: [],
    cardNames: [],
    cardIndex: {},
    cachedCardImageIds: []
}

export enum EncyclopediaActionTypes {
    Load = 'ENCYCLOPEDIA_LOAD',
    LoadCardImage = 'ENCYCLOPEDIA_LOAD_CARD_IMAGE'
}

export type EncyclopediaLoadAction = {
    type: EncyclopediaActionTypes.Load,
    value: AsyncRequest<void, Card[]>
}

export type LoadCardImageAction = {
    type: EncyclopediaActionTypes.LoadCardImage,
    value: AsyncRequest<string, string>
}

export type EncyclopediaAction =
    EncyclopediaLoadAction |
    LoadCardImageAction;

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
    },
    loadCardImageStart(scryfallId: string) : LoadCardImageAction {
        return {
            type: EncyclopediaActionTypes.LoadCardImage,
            value: asyncRequest.started(scryfallId)
        };
    },
    loadCardImageSuccess(scryfallId: string) : LoadCardImageAction {
        return {
            type: EncyclopediaActionTypes.LoadCardImage,
            value: asyncRequest.success(scryfallId)
        };
    },
    loadCardImageError(error: string) : LoadCardImageAction {
        return {
            type: EncyclopediaActionTypes.LoadCardImage,
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
                case AsyncRequestStatus.Success: {
                    const cards = action.value.data;
                    const sets = CardModule.toSetInfos(cards);
                    const cardNames = sortAndDeduplicate(cards.map(c => c.name));

                    const cardIndex : CardIndex = {};
                    cards.forEach(c => {
                        cardIndex[c.id] = c;
                    })

                    return {
                        ...state,
                        isLoading: false,
                        cards,
                        sets,
                        cardNames,
                        cardIndex
                    };
                }
                case AsyncRequestStatus.Failure:
                    return {
                        ...state,
                        isLoading: false
                    };
                default:
                    return state;
            }
        }
        case EncyclopediaActionTypes.LoadCardImage: {
            switch (action.value.status) {
                case AsyncRequestStatus.Success: {
                    return {
                        ...state,
                        cachedCardImageIds: [ ...state.cachedCardImageIds, action.value.data ]
                    }
                }
                default: return state;
            }
        }
        default:
            return state;
    }
}
