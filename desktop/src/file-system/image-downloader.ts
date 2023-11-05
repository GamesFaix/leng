import * as fs from "fs";
import { Card, Set } from "scryfall-api";
import { createDirForFileIfMissing } from "../file-system/file-helpers";
import { AppSettings } from "leng-core/src/logic/model";
import { imagePathProvider } from "../file-system";
import { ImageDownloader } from "leng-core/src/logic/interfaces";

const downloadFile = async (fromUrl: string, toPath: string) => {
  const response = await fetch(fromUrl);
  const buffer = await response.arrayBuffer();
  const data = new Uint8Array(buffer);
  createDirForFileIfMissing(toPath);
  await fs.promises.writeFile(toPath, data);
};

const downloadFileIfMissing = async (
  localPath: string,
  sourceUrl: string
): Promise<void> => {
  if (!fs.existsSync(localPath)) {
    // createDirForFileIfMissing(localPath); // TODO: This isn't working, folder must pre-exist!
    await downloadFile(sourceUrl, localPath);
  }
};

const downloadSetSymbol = async (
  settings: AppSettings,
  set: Set
): Promise<void> => {
  const path = imagePathProvider.getSetSymbolPath(settings, set.code);
  const uri = set.icon_svg_uri;
  return downloadFileIfMissing(path, uri);
};

const downloadCardImage = async (
  settings: AppSettings,
  card: Card
): Promise<void> => {
  const path = imagePathProvider.getCardImagePath(settings, card);
  const uri =
    card.image_uris?.small ??
    card.image_uris?.normal ??
    card.image_uris?.large ??
    card.image_uris?.png ??
    "";
  return downloadFileIfMissing(path, uri);
};

export const imageDownloader: ImageDownloader = {
  downloadCardImage,
  downloadSetSymbol,
};