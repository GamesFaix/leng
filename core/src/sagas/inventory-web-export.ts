import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  inventoryActions,
  InventoryActionTypes,
  WebExportAction,
} from "../store/inventory";
import { selectors } from "../store";
import { InventoryWebExportProvider } from "../domain/interfaces";
import { Inventory, toFileBox } from "../domain/inventory-files";
import { Box } from "../domain/inventory";
import { AsyncRequestStatus } from "../domain/async-request";
import { AppSettings } from "../domain/config";

export const getInventoryWebExportSaga = (
  provider: InventoryWebExportProvider
) => {
  function* webExport(action: WebExportAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const boxes: Box[] = yield select(selectors.boxes);
      const inventory: Inventory = { boxes: boxes.map(toFileBox) };
      yield call(() => provider.exportCards(settings, inventory));
      yield put(inventoryActions.webExportSuccess());
    } catch (error) {
      yield put(inventoryActions.webExportFailure(`${error}`));
    }
  }

  return function* saga() {
    yield takeEvery(InventoryActionTypes.WebExport, webExport);
  };
};
