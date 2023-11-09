import { ThemeProvider } from "@mui/material";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "leng-core/src/components/app";
import { store } from "leng-core/src/store";
import "./styles.scss";
import { runSagas } from "leng-core/src/sagas";
import {
  cardDataProvider,
  imageDownloader,
  imagePathProvider,
  inventoryReadProvider,
  inventoryWriteProvider,
  settingsProvider,
  tappedOutCsvExportProvider,
  inventoryWebExportProvider,
} from "./file-system";
import { darkTheme } from "leng-core/src/ui";
import {
  ClientCapabilitiesContext,
  ExternalLinkContext,
  ImagePathContext,
} from "leng-core/src/contexts";
import { externalLinkProvider } from "./external-link-provider";
import { ClientCapabilities } from "leng-core/src/logic/model";

const capabilities: ClientCapabilities = {
  view: {
    boxes: true,
    collection: true,
    reports: true,
    settings: true,
  },
  edit: {
    boxes: true,
  },
  export: {
    tappedOutCsv: true,
    webJson: true,
  },
};

runSagas({
  images: imageDownloader,
  settings: settingsProvider,
  cardData: cardDataProvider,
  inventoryRead: inventoryReadProvider,
  inventoryWrite: inventoryWriteProvider,
  tappedOut: tappedOutCsvExportProvider,
  webExport: inventoryWebExportProvider,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <ThemeProvider theme={darkTheme}>
      <ImagePathContext.Provider value={imagePathProvider}>
        <ExternalLinkContext.Provider value={externalLinkProvider}>
          <ClientCapabilitiesContext.Provider value={capabilities}>
            <App />
          </ClientCapabilitiesContext.Provider>
        </ExternalLinkContext.Provider>
      </ImagePathContext.Provider>
    </ThemeProvider>
  </Provider>
);
