import { ImagePathProvider } from "leng-core/src/domain/interfaces";
import { AppSettings } from "leng-core/src/domain/config";
import { Card, Set } from "leng-core/src/domain/encyclopedia";

const getSetSymbolPath = (_: AppSettings, set: Set): string => set.icon_svg_uri;

const getCardImagePath = (_: AppSettings, card: Card): string =>
  card.image_uri ?? "";

export const imagePathProvider: ImagePathProvider = {
  getSetSymbolPath,
  getCardImagePath,
};
