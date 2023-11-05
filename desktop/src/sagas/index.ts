import imagesSaga from "./images";
import { sagaMiddleware } from "leng-core/src/store";
import {
  getCardDataSaga,
  getSettingsSaga,
  getInventoryReadSaga,
  getInventoryWriteSaga,
  getTappedOutCsvExportSaga,
  preloadSaga,
  searchSaga
} from "leng-core/src/sagas";
import {
  cardDataProvider,
  inventoryReadProvider,
  inventoryWriteProvider,
  settingsProvider,
  tappedOutCsvExportProvider,
} from "../file-system";

export const runSagas = () => {
  const sagas = [
    getSettingsSaga(settingsProvider),
    imagesSaga,
    getCardDataSaga(cardDataProvider),
    getInventoryReadSaga(inventoryReadProvider),
    getInventoryWriteSaga(inventoryWriteProvider),
    getTappedOutCsvExportSaga(tappedOutCsvExportProvider),
    preloadSaga,
    searchSaga,
  ];
  sagas.forEach(sagaMiddleware.run);
};
