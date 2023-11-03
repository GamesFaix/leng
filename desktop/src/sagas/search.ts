import { call, put, takeEvery } from "redux-saga/effects";
import { Card } from "scryfall-api";
import { AsyncRequestStatus } from "leng-core/src/logic/model";
import { searchScryfall } from "leng-core/src/logic/search";
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

function* searchSaga() {
  yield takeEvery(SearchActionTypes.Search, search);
}
export default searchSaga;
