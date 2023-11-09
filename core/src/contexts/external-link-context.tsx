import { createContext } from "react";
import { ExternalLinkProvider } from "../logic/interfaces";

const defaultValue: ExternalLinkProvider = {
  openLink: (_) => { return; }
};

export const ExternalLinkContext = createContext(defaultValue);
