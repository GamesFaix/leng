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
import * as Uuid from "uuid";

const isSingletonRegistered = () => !!(window as any).lengId;
const registerSingleton = (id: string) => {
  (window as any).lengId = id;
};

const initReduxSaga = () => {
  console.log("initReduxSaga");
  runSagas({
    settings: settingsProvider,
    cardData: cardDataProvider,
    inventoryRead: inventoryReadProvider,
  });
};

const initReact = () => {
  console.log("initReact");

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
};

const init = () => {
  const id = Uuid.v4();
  console.log(`initializing leng instance ${id}`);

  if (isSingletonRegistered()) {
    console.log(`already running, instance ${id} aborting`);
    return;
  }

  console.log(`no other instances. instance ${id} continuing`);
  registerSingleton(id);
  initReduxSaga();
  initReact();
};

init();
