import { call, put, select, takeEvery } from "redux-saga/effects";
import { getCards } from "../domain/filters";
import { toTappedOutCsvExportCards } from "../domain/export/tappedout-csv-export";
import {
  TappedOutCsvExportAction,
  inventoryActions,
  InventoryActionTypes,
} from "../store/inventory";
import { selectors } from "../store";
import { TappedOutCsvExportProvider } from "../domain/interfaces";
import { Box } from "../domain/inventory";
import { AsyncRequestStatus } from "../domain/async-request";
import { AppSettings } from "../domain/config";
import { CardIndex } from "../domain/encyclopedia";
import { defaultCardFilter } from "../domain/filters";

export const getTappedOutCsvExportSaga = (
  provider: TappedOutCsvExportProvider
) => {
  function* tappedOutCsvExport(action: TappedOutCsvExportAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const boxes: Box[] = yield select(selectors.boxes);
      const cards = getCards(boxes, defaultCardFilter, {}, []);
      const cardIndex: CardIndex = yield select(selectors.cardIndex);
      const csvCards = toTappedOutCsvExportCards(cards, cardIndex);
      yield call(() => provider.exportCards(settings, csvCards));
      yield put(inventoryActions.csvExportSuccess());
    } catch (error) {
      yield put(inventoryActions.csvExportFailure(`${error}`));
    }
  }

  return function* saga() {
    yield takeEvery(
      InventoryActionTypes.TappedOutCsvExport,
      tappedOutCsvExport
    );
  };
};
