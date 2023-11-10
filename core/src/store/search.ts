import { Card } from "../domain/encyclopedia";
import { asyncRequest, AsyncRequest, AsyncRequestStatus } from "../domain/async-request";

export type SearchState = {
  loading: boolean;
  query: string;
  results: Card[];
};

const defaultSearchState: SearchState = {
  loading: false,
  query: "",
  results: [],
};

export enum SearchActionTypes {
  Search = "SEARCH",
}

export type SearchAction = {
  type: SearchActionTypes.Search;
  value: AsyncRequest<string, Card[]>;
};

export const searchActions = {
  searchStart(query: string): SearchAction {
    return {
      type: SearchActionTypes.Search,
      value: asyncRequest.started(query),
    };
  },
  searchSuccess(results: Card[]): SearchAction {
    return {
      type: SearchActionTypes.Search,
      value: asyncRequest.success(results),
    };
  },
  searchFailure(error: string): SearchAction {
    return {
      type: SearchActionTypes.Search,
      value: asyncRequest.failure(error),
    };
  },
};

export function searchReducer(
  state: SearchState = defaultSearchState,
  action: SearchAction
): SearchState {
  switch (action.type) {
    case SearchActionTypes.Search:
      switch (action?.value?.status) {
        case AsyncRequestStatus.Started:
          return { ...state, loading: true, query: action.value.data };
        case AsyncRequestStatus.Failure:
          return { ...state, loading: false };
        case AsyncRequestStatus.Success:
          return { ...state, loading: false, results: action.value.data };
        default:
          return state;
      }
    default:
      return state;
  }
}
