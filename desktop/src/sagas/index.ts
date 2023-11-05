import imagesSaga from "./images";
import preloadSaga from "./preload";
import searchSaga from "leng-core/src/sagas/search";
import { sagaMiddleware } from "leng-core/src/store";
import { getCardDataSaga, getSettingsSaga, getInventoryReadSaga, getInventoryWriteSaga, getTappedOutCsvExportSaga } from "leng-core/src/sagas";
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
