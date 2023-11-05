import encyclopediaSaga from "./encyclopedia";
import preloadSaga from "./preload";
import searchSaga from "leng-core/src/sagas/search";
import { sagaMiddleware } from "leng-core/src/store";
import { tappedOutCsvExportProvider } from "./tapped-out-csv-export-provider";
import { inventoryWriteProvider } from "./inventory-write-provider";
import { inventoryReadProvider } from "./inventory-read-provider";
import { getSettingsSaga } from "leng-core/src/sagas/settings";
import { getInventoryReadSaga } from "leng-core/src/sagas/inventory-read";
import { getInventoryWriteSaga } from "leng-core/src/sagas/inventory-write";
import { getTappedOutCsvExportSaga } from "leng-core/src/sagas/tapped-out-csv-export";
import { settingsProvider } from "./settings-provider";

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
