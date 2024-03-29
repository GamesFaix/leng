import { call, put, select, takeEvery, takeLeading } from "redux-saga/effects";
import {
  BoxInfosLoadAction,
  BoxLoadAction,
  inventoryActions,
  InventoryActionTypes,
} from "../store/inventory";
import { selectors } from "../store";
import { InventoryReadProvider } from "../domain/interfaces";
import { AsyncRequestStatus } from "../domain/async-request";
import { AppSettings } from "../domain/config";
import { CardIndex } from "../domain/encyclopedia";
import { Box, BoxInfo } from "../domain/inventory";

export const getInventoryReadSaga = (provider: InventoryReadProvider) => {
  function* loadBoxInfos(action: BoxInfosLoadAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const boxInfos: BoxInfo[] = yield call(() =>
        provider.loadBoxInfos(settings)
      );
      yield put(inventoryActions.boxInfosLoadSuccess(boxInfos));
    } catch (error) {
      yield put(inventoryActions.boxInfosLoadFailure(`${error}`));
    }
  }
  function* loadBox(action: BoxLoadAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const cardIndex: CardIndex = yield select(selectors.cardIndex);
      const name = action.value.data;
      const box: Box = yield call(() =>
        provider.loadBox(settings, name, cardIndex)
      );
      yield put(inventoryActions.boxLoadSuccess(box));
    } catch (error) {
      yield put(inventoryActions.boxLoadFailure(`${error}`));
    }
  }

  return function* saga() {
    yield takeLeading(InventoryActionTypes.BoxInfosLoad, loadBoxInfos);
    yield takeEvery(InventoryActionTypes.BoxLoad, loadBox);
  };
};
