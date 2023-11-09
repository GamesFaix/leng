import { call, put, takeEvery } from "redux-saga/effects";
import { Card } from "../domain/encyclopedia";
import { AsyncRequestStatus } from "../domain/async-request";
import { searchScryfall } from "../domain/scryfall";
import {
  SearchAction,
  searchActions,
  SearchActionTypes,
} from "../store/search";

function* search(action: SearchAction) {
  if (action.value.status !== AsyncRequestStatus.Started) {
    return;
  }

  try {
    const query = action.value.data;
    const results: Card[] = yield call(() => searchScryfall(query));
    yield put(searchActions.searchSuccess(results));
  } catch (error) {
    yield put(searchActions.searchFailure(`${error}`));
  }
}

export const searchSaga = function* () {
  yield takeEvery(SearchActionTypes.Search, search);
}