import { ThemeProvider } from "@mui/material";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "leng-core/src/components/app";
import { store } from "leng-core/src/store";
import "./styles.scss";
import { runSagas } from "leng-core/src/sagas";
import {
  ExternalLinkContext,
  ImagePathContext,
  darkTheme,
} from "leng-core/src/ui";
import {
  imagePathProvider,
  externalLinkProvider,
  settingsProvider,
  cardDataProvider,
  inventoryReadProvider,
} from "./logic";

console.log("main.tsx");

runSagas({
  settings: settingsProvider,
  cardData: cardDataProvider,
  inventoryRead: inventoryReadProvider,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <ThemeProvider theme={darkTheme}>
      <ImagePathContext.Provider value={imagePathProvider}>
        <ExternalLinkContext.Provider value={externalLinkProvider}>
          <App />
        </ExternalLinkContext.Provider>
      </ImagePathContext.Provider>
    </ThemeProvider>
  </Provider>
);
