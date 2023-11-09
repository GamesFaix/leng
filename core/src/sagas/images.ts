import { call, put, select, takeEvery } from "redux-saga/effects";
import { Card, Set } from "../domain/encyclopedia";
import { RootState } from "../store";
import {
  encyclopediaActions,
  EncyclopediaActionTypes,
  LoadCardImageAction,
  LoadSetSymbolAction,
} from "../store/encyclopedia";
import { selectors } from "../store";
import { ImageDownloader } from "../domain/interfaces";
import { AsyncRequestStatus } from "../domain/async-request";
import { AppSettings } from "../domain/config";

export const getImagesSaga = (imageDownloader: ImageDownloader) => {
  function* loadSetSymbol(action: LoadSetSymbolAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const setAbbrev = action.value.data;
      const settings: AppSettings = yield select(selectors.settings);
      const set: Set = yield select(selectors.set(setAbbrev));
      yield call(() => imageDownloader.downloadSetSymbol(settings, set));
      yield put(encyclopediaActions.loadSetSymbolSuccess(setAbbrev));
    } catch (error) {
      yield put(encyclopediaActions.loadSetSymbolError(`${error}`));
    }
  }

  function* loadCardImage(action: LoadCardImageAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const scryfallId = action.value.data;
      const settings: AppSettings = yield select(selectors.settings);
      const card: Card = yield select(
        (state: RootState) => state.encyclopedia.cardIndex[scryfallId]
      );
      yield call(() => imageDownloader.downloadCardImage(settings, card));
      yield put(encyclopediaActions.loadCardImageSuccess(scryfallId));
    } catch (error) {
      yield put(encyclopediaActions.loadCardImageError(`${error}`));
    }
  }

  return function* saga() {
    yield takeEvery(EncyclopediaActionTypes.LoadSetSymbol, loadSetSymbol);
    yield takeEvery(EncyclopediaActionTypes.LoadCardImage, loadCardImage);
  };
};
