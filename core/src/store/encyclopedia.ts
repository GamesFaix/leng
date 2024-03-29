import { uniq } from "lodash";
import { AsyncRequest, asyncRequest, AsyncRequestStatus } from "../domain/async-request";
import { Card, Set, CardIndex, SetIndex } from "../domain/encyclopedia";
import { FormatGroup } from "../domain/formats";

export type EncyclopediaState = {
  cards: Card[];
  sets: Set[];
  formats: FormatGroup[];
  cardNames: string[];
  cardIndex: CardIndex;
  setIndex: SetIndex;
  cachedSetSymbolAbbrevs: string[];
  cachedCardImageIds: string[];
};

const encyclopediaDefaultState: EncyclopediaState = {
  cards: [],
  sets: [],
  formats: [],
  cardNames: [],
  cardIndex: {},
  setIndex: {},
  cachedSetSymbolAbbrevs: [],
  cachedCardImageIds: [],
};

export enum EncyclopediaActionTypes {
  LoadCardData = "ENCYCLOPEDIA_LOAD_CARD_DATA",
  LoadSetData = "ENCYCLOPEDIA_LOAD_SET_DATA",
  LoadFormatData = "ENCYCLOPEDIA_LOAD_FORMAT_DATA",
  LoadSetSymbol = "ENCYCLOPEDIA_LOAD_SET_ICON",
  LoadCardImage = "ENCYCLOPEDIA_LOAD_CARD_IMAGE",
}

export type LoadCardDataAction = {
  type: EncyclopediaActionTypes.LoadCardData;
  value: AsyncRequest<void, Card[]>;
};

export type LoadSetDataAction = {
  type: EncyclopediaActionTypes.LoadSetData;
  value: AsyncRequest<void, Set[]>;
};

export type LoadFormatDataAction = {
  type: EncyclopediaActionTypes.LoadFormatData;
  value: AsyncRequest<void, FormatGroup[]>;
};

export type LoadSetSymbolAction = {
  type: EncyclopediaActionTypes.LoadSetSymbol;
  value: AsyncRequest<string, string>;
};

export type LoadCardImageAction = {
  type: EncyclopediaActionTypes.LoadCardImage;
  value: AsyncRequest<string, string>;
};

export type EncyclopediaAction =
  | LoadCardDataAction
  | LoadSetDataAction
  | LoadFormatDataAction
  | LoadSetSymbolAction
  | LoadCardImageAction;

export const encyclopediaActions = {
  loadCardDataStart(): LoadCardDataAction {
    return {
      type: EncyclopediaActionTypes.LoadCardData,
      value: asyncRequest.started(undefined),
    };
  },
  loadCardDataSuccess(cards: Card[]): LoadCardDataAction {
    return {
      type: EncyclopediaActionTypes.LoadCardData,
      value: asyncRequest.success(cards),
    };
  },
  loadCardDataError(error: string): LoadCardDataAction {
    return {
      type: EncyclopediaActionTypes.LoadCardData,
      value: asyncRequest.failure(error),
    };
  },
  loadSetDataStart(): LoadSetDataAction {
    return {
      type: EncyclopediaActionTypes.LoadSetData,
      value: asyncRequest.started(undefined),
    };
  },
  loadSetDataSuccess(sets: Set[]): LoadSetDataAction {
    return {
      type: EncyclopediaActionTypes.LoadSetData,
      value: asyncRequest.success(sets),
    };
  },
  loadSetDataError(error: string): LoadSetDataAction {
    return {
      type: EncyclopediaActionTypes.LoadSetData,
      value: asyncRequest.failure(error),
    };
  },
  loadFormatDataStart(): LoadFormatDataAction {
    return {
      type: EncyclopediaActionTypes.LoadFormatData,
      value: asyncRequest.started(undefined),
    };
  },
  loadFormatDataSuccess(formats: FormatGroup[]): LoadFormatDataAction {
    return {
      type: EncyclopediaActionTypes.LoadFormatData,
      value: asyncRequest.success(formats),
    };
  },
  loadFormatDataError(error: string): LoadFormatDataAction {
    return {
      type: EncyclopediaActionTypes.LoadFormatData,
      value: asyncRequest.failure(error),
    };
  },
  loadSetSymbolStart(setAbbrev: string): LoadSetSymbolAction {
    return {
      type: EncyclopediaActionTypes.LoadSetSymbol,
      value: asyncRequest.started(setAbbrev),
    };
  },
  loadSetSymbolSuccess(setAbbrev: string): LoadSetSymbolAction {
    return {
      type: EncyclopediaActionTypes.LoadSetSymbol,
      value: asyncRequest.success(setAbbrev),
    };
  },
  loadSetSymbolError(error: string): LoadSetSymbolAction {
    return {
      type: EncyclopediaActionTypes.LoadSetSymbol,
      value: asyncRequest.failure(error),
    };
  },
  loadCardImageStart(scryfallId: string): LoadCardImageAction {
    return {
      type: EncyclopediaActionTypes.LoadCardImage,
      value: asyncRequest.started(scryfallId),
    };
  },
  loadCardImageSuccess(scryfallId: string): LoadCardImageAction {
    return {
      type: EncyclopediaActionTypes.LoadCardImage,
      value: asyncRequest.success(scryfallId),
    };
  },
  loadCardImageError(error: string): LoadCardImageAction {
    return {
      type: EncyclopediaActionTypes.LoadCardImage,
      value: asyncRequest.failure(error),
    };
  },
};

const sortAndDeduplicate = (xs: string[]) => uniq(xs).sort();

export function encyclopediaReducer(
  state: EncyclopediaState = encyclopediaDefaultState,
  action: EncyclopediaAction
): EncyclopediaState {
  switch (action.type) {
    case EncyclopediaActionTypes.LoadCardData: {
      switch (action.value.status) {
        case AsyncRequestStatus.Success: {
          const cards = action.value.data;
          const cardNames = sortAndDeduplicate(cards.map((c) => c.name));

          const cardIndex: CardIndex = {};
          cards.forEach((c) => {
            cardIndex[c.id] = c;
          });

          return {
            ...state,
            cards,
            cardNames,
            cardIndex,
          };
        }
        default:
          return state;
      }
    }
    case EncyclopediaActionTypes.LoadSetData: {
      switch (action.value.status) {
        case AsyncRequestStatus.Success: {
          const sets = action.value.data;

          const setIndex: SetIndex = {};
          sets.forEach((s) => {
            setIndex[s.code] = s;
          });

          return {
            ...state,
            sets,
            setIndex,
          };
        }
        default:
          return state;
      }
    }
    case EncyclopediaActionTypes.LoadFormatData: {
      switch (action.value.status) {
        case AsyncRequestStatus.Success: {
          const formats = action.value.data;
          return {
            ...state,
            formats,
          };
        }
        default:
          return state;
      }
    }
    case EncyclopediaActionTypes.LoadSetSymbol: {
      switch (action.value.status) {
        default:
          return state;
      }
    }
    case EncyclopediaActionTypes.LoadCardImage: {
      switch (action.value.status) {
        case AsyncRequestStatus.Success: {
          return {
            ...state,
            cachedCardImageIds: [
              ...state.cachedCardImageIds,
              action.value.data,
            ],
          };
        }
        default:
          return state;
      }
    }
    default:
      return state;
  }
}
