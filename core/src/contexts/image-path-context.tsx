import { createContext } from "react";
import { ImagePathProvider } from "../domain/interfaces";

const defaultValue: ImagePathProvider = {
  getCardImagePath: () => {
    throw "Not implemented";
  },
  getSetSymbolPath: () => {
    throw "Not implemented";
  },
};

export const ImagePathContext = createContext(defaultValue);
