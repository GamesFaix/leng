import { CardDataProvider } from "../logic/interfaces";
import { call, put, select, takeLeading } from "redux-saga/effects";
import { Card, Set } from "scryfall-api";
import { AppSettings, AsyncRequestStatus } from "../logic/model";
import {
  encyclopediaActions,
  EncyclopediaActionTypes,
  LoadCardDataAction,
  LoadSetDataAction,
} from "../store/encyclopedia";
import selectors from "../store/selectors";

export const getCardDataSaga = (provider: CardDataProvider) => {
  function* loadCardData(action: LoadCardDataAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const cards: Card[] = yield call(() => provider.getAllCards(settings));
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
      const sets: Set[] = yield call(() => provider.getAllSets(settings));
      yield put(encyclopediaActions.loadSetDataSuccess(sets));
    } catch (error) {
      yield put(encyclopediaActions.loadSetDataError(`${error}`));
    }
  }
  return function* saga() {
    yield takeLeading(EncyclopediaActionTypes.LoadCardData, loadCardData);
    yield takeLeading(EncyclopediaActionTypes.LoadSetData, loadSetData);
  };
};
