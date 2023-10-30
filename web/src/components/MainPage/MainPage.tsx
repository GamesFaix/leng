import { FC, useEffect } from "react";
import "./MainPage.scss";
import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import { routes } from "../../routes";

export const MainPage: FC = () => {

  useEffect(() => {
    // TODO: Initialize data
// eslint-disable-next-line react-hooks/exhaustive-deps      
  },[]); // Don't re-run

  return (
    <>
      <header className="row">
        <Header />
      </header>
      <div id="app-body" className="row">
        <Routes>
          <Route path={routes.home} element={<span>Home page</span>} />
          <Route path={routes.search} element={<span>Search page</span>} />
          <Route path={routes.report} element={<span>Report page</span>} />
        </Routes>
      </div>
      <footer className="row">Footer</footer>
    </>
  );
};
