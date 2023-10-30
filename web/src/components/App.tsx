import { FC } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { MainPage } from "./MainPage/MainPage";
import { store } from "../store/store";

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App: FC = () => (
  <ReduxProvider store={store}>
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    </ThemeProvider>
  </ReduxProvider>
);

export default App;
