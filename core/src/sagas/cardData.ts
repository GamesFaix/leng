import { CardDataProvider, FormatProvider } from "../domain/interfaces";
import { call, put, select, takeLeading } from "redux-saga/effects";
import { Card, Set } from "../domain/encyclopedia";
import {
  encyclopediaActions,
  EncyclopediaActionTypes,
  LoadCardDataAction,
  LoadFormatDataAction,
  LoadSetDataAction,
} from "../store/encyclopedia";
import { selectors } from "../store";
import { AsyncRequestStatus } from "../domain/async-request";
import { AppSettings } from "../domain/config";
import { FormatGroup } from "../domain/formats";

export const getCardDataSaga = (
  cardDataProvider: CardDataProvider,
  formatProvider: FormatProvider
) => {
  function* loadCardData(action: LoadCardDataAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const cards: Card[] = yield call(() =>
        cardDataProvider.getAllCards(settings)
      );
      console.log(`saga received ${cards.length} cards`);
      yield put(encyclopediaActions.loadCardDataSuccess(cards));
    } catch (error) {
      yield put(encyclopediaActions.loadCardDataError(`${error}`));
    }
  }

  function* loadSetData(action: LoadSetDataAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const sets: Set[] = yield call(() =>
        cardDataProvider.getAllSets(settings)
      );
      console.log(`saga received ${sets.length} sets`);
      yield put(encyclopediaActions.loadSetDataSuccess(sets));
    } catch (error) {
      yield put(encyclopediaActions.loadSetDataError(`${error}`));
    }
  }

  function* loadFormatData(action: LoadFormatDataAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const formats: FormatGroup[] = yield call(() =>
        formatProvider.getFormats(settings)
      );
      console.log(`saga received ${formats.length} format groups`);
      yield put(encyclopediaActions.loadFormatDataSuccess(formats));
    } catch (error) {
      yield put(encyclopediaActions.loadFormatDataError(`${error}`));
    }
  }

  return function* saga() {
    yield takeLeading(EncyclopediaActionTypes.LoadCardData, loadCardData);
    yield takeLeading(EncyclopediaActionTypes.LoadSetData, loadSetData);
    yield takeLeading(EncyclopediaActionTypes.LoadFormatData, loadFormatData);
  };
};
