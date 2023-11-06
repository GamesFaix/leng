import { ThemeProvider } from "@mui/material";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/app";
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
} from "./file-system";
import {
  ExternalLinkContext,
  ImagePathContext,
  darkTheme,
} from "leng-core/src/ui";
import { externalLinkProvider } from "./external-link-provider";

runSagas({
  images: imageDownloader,
  settings: settingsProvider,
  cardData: cardDataProvider,
  inventoryRead: inventoryReadProvider,
  inventoryWrite: inventoryWriteProvider,
  tappedOut: tappedOutCsvExportProvider,
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={darkTheme}>
      <ImagePathContext.Provider value={imagePathProvider}>
        <ExternalLinkContext.Provider value={externalLinkProvider}>
          <App />
        </ExternalLinkContext.Provider>
      </ImagePathContext.Provider>
    </ThemeProvider>
  </Provider>,
  document.getElementById("app")
);
