import encyclopediaSaga from "./encyclopedia";
import preloadSaga from "./preload";
import searchSaga from "leng-core/src/sagas/search";
import { sagaMiddleware } from "leng-core/src/store";
import { getSettingsSaga } from "leng-core/src/sagas/settings";
import { getInventoryReadSaga } from "leng-core/src/sagas/inventory-read";
import { getInventoryWriteSaga } from "leng-core/src/sagas/inventory-write";
import { getTappedOutCsvExportSaga } from "leng-core/src/sagas/tapped-out-csv-export";
import { inventoryReadProvider, inventoryWriteProvider, settingsProvider, tappedOutCsvExportProvider } from "../file-system";

export const runSagas = () => {
  const sagas = [
    getSettingsSaga(settingsProvider),
    encyclopediaSaga,
    getInventoryReadSaga(inventoryReadProvider),
    getInventoryWriteSaga(inventoryWriteProvider),
    getTappedOutCsvExportSaga(tappedOutCsvExportProvider),
    preloadSaga,
    searchSaga,
  ];
  sagas.forEach(sagaMiddleware.run);
};
