import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, HashRouter, Routes } from "react-router-dom";
import {
  CollectionPage,
  ReportsPage,
  SettingsPage,
  BoxPage,
  BoxesPage,
} from "./pages";
import SplashScreen from "./splash-screen";
import { preloadActions } from "../store/preload";
import { selectors } from "../store";
import NavBar from "./navbar";

export const App = () => {
  const dispatch = useDispatch();
  const { ready, message } = useSelector(selectors.preload);

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
          <Route path="/" element={<BoxesPage />} />
          <Route path="/boxes/:name" element={<BoxPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      ) : (
        <SplashScreen message={message} />
      )}
    </HashRouter>
  );
};
