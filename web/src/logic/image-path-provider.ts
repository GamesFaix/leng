import { ImagePathProvider } from "leng-core/src/logic/interfaces";
import { AppSettings } from "leng-core/src/logic/model";
import { Card, Set } from "scryfall-api";

const getSetSymbolPath = (_: AppSettings, set: Set): string => set.icon_svg_uri;

const getCardImagePath = (_: AppSettings, card: Card): string =>
  card.image_uris?.small ??
  card.image_uris?.normal ??
  card.image_uris?.large ??
  card.image_uris?.png ??
  "";

export const imagePathProvider : ImagePathProvider = {
  getSetSymbolPath,
  getCardImagePath,
};
