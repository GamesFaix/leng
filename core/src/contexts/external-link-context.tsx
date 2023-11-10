import { createContext } from "react";
import { ExternalLinkProvider } from "../domain/interfaces";

const defaultValue: ExternalLinkProvider = {
  openLink: (_) => { return; }
};

export const ExternalLinkContext = createContext(defaultValue);
