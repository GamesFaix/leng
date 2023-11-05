import { call, put, select, takeEvery, takeLeading } from "redux-saga/effects";
import { getCards } from "../logic/card-filters";
import { toTappedOutCsvExportCards } from "../logic/tappedout-csv-export";
import {
  AppSettings,
  AsyncRequestStatus,
  Box,
  CardIndex,
  defaultCardFilter,
} from "../logic/model";
import {
  TappedOutCsvExportAction,
  inventoryActions,
  InventoryActionTypes,
} from "../store/inventory";
import selectors from "../store/selectors";
import { TappedOutCsvExportProvider } from "../logic/interfaces";

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
