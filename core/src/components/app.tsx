import * as React from "react";
import { Route, HashRouter, Routes } from "react-router-dom";
import {
  CollectionPage,
  ReportsPage,
  SettingsPage,
  BoxPage,
  BoxesPage,
  HomePage,
} from "./pages";
import SplashScreen from "./splash-screen";
import { preloadActions } from "../store/preload";
import { selectors } from "../store";
import NavBar from "./navbar";
import { useAppDispatch, useAppSelector, useCapabilities } from "../hooks";

export const App = () => {
  const dispatch = useAppDispatch();
  const { ready, message } = useAppSelector(selectors.preload);
  const caps = useCapabilities();

  React.useLayoutEffect(() => {
    if (!ready && message === "") {
      dispatch(preloadActions.start());
    }
  });

  return (
    <HashRouter>
      <NavBar />
      {ready ? (
        <Routes>
          {caps.view?.boxes && (
            <>
              <Route path="/boxes" element={<BoxesPage />} />
              <Route path="/boxes/:name" element={<BoxPage />} />
            </>
          )}
          {caps.view?.settings && (
            <Route path="/settings" element={<SettingsPage />} />
          )}
          {caps.view?.collection && (
            <Route path="/collection" element={<CollectionPage />} />
          )}
          {caps.view?.reports && (
            <Route path="/reports" element={<ReportsPage />} />
          )}
          <Route path="*" element={<HomePage/>} />
        </Routes>
      ) : (
        <SplashScreen message={message} />
      )}
    </HashRouter>
  );
};
