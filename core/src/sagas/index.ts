import { getInventoryReadSaga } from "./inventory-read";
import { getInventoryWriteSaga } from "./inventory-write";
import { getTappedOutCsvExportSaga } from "./tapped-out-csv-export";
import { getSettingsSaga } from "./settings";
import { getCardDataSaga } from "./cardData";
import { searchSaga } from "./search";
import { preloadSaga } from "./preload";
import { getImagesSaga } from "./images";
import { sagaMiddleware } from "../store";
import {
  CardDataProvider,
  ImageDownloader,
  InventoryReadProvider,
  InventoryWriteProvider,
  SettingsProvider,
  TappedOutCsvExportProvider,
} from "../logic/interfaces";

type SagaProviders = {
  settings: SettingsProvider;
  images: ImageDownloader;
  cardData: CardDataProvider;
  inventoryRead: InventoryReadProvider;
  inventoryWrite: InventoryWriteProvider;
  tappedOut: TappedOutCsvExportProvider;
};

export const runSagas = (providers: Partial<SagaProviders>) => {
  const sagas = [preloadSaga, searchSaga];

  if (providers.settings) {
    sagas.push(getSettingsSaga(providers.settings));
  }
  if (providers.images) {
    sagas.push(getImagesSaga(providers.images));
  }
  if (providers.cardData) {
    sagas.push(getCardDataSaga(providers.cardData));
  }
  if (providers.inventoryRead) {
    sagas.push(getInventoryReadSaga(providers.inventoryRead));
  }
  if (providers.inventoryWrite) {
    sagas.push(getInventoryWriteSaga(providers.inventoryWrite));
  }
  if (providers.tappedOut) {
    sagas.push(getTappedOutCsvExportSaga(providers.tappedOut));
  }

  sagas.forEach(sagaMiddleware.run);
};
