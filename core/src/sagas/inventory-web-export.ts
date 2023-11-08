import { call, put, select, takeEvery } from "redux-saga/effects";
import { AppSettings, AsyncRequestStatus, Box } from "../logic/model";
import {
  inventoryActions,
  InventoryActionTypes,
  WebExportAction,
} from "../store/inventory";
import { selectors } from "../store";
import { InventoryWebExportProvider } from "../logic/interfaces";
import { Inventory, toFileBox } from "../logic/inventory";

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
