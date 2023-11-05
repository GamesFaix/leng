import * as fs from "fs";
import { orderBy } from "lodash";
import { parse } from "path";
import { createDirIfMissing } from "./file-helpers";
import {
  AppSettings,
  Box,
  BoxInfo,
  CardFinish,
  CardIndex,
  FileBox,
  getVersionLabel,
  Language,
  normalizeName,
} from "leng-core/src/logic/model";
import { InventoryReadProvider } from "leng-core/src/logic/interfaces";
import { getBoxPath, getInventoryDir } from "./inventory-common";

const loadBoxInfos = async (settings: AppSettings): Promise<BoxInfo[]> => {
  const dir = getInventoryDir(settings);
  createDirIfMissing(dir);
  let files = await fs.promises.readdir(dir);
  files = orderBy(files, (f) => f.toLowerCase());

  const promises = files.map(async (f) => {
    const stats = await fs.promises.stat(`${dir}/${f}`);
    return {
      name: parse(f).name,
      lastModified: stats.mtime,
    };
  });

  return Promise.all(promises);
};

const getFinish = (finish: CardFinish, foil: boolean): CardFinish => {
  if (finish) return finish;
  return foil ? CardFinish.Foil : CardFinish.Normal;
};

const fromFileBox = (fileBox: FileBox, cardIndex: CardIndex): Box => ({
  name: fileBox.name,
  lastModified: fileBox.lastModified,
  description: fileBox.description,
  cards: fileBox.cards.map((c) => {
    const match = cardIndex[c.scryfallId];
    return {
      name: c.name,
      setAbbrev: c.setAbbrev,
      setName: match?.set_name ?? "",
      scryfallId: c.scryfallId,
      lang: c.lang ?? Language.English,
      finish: getFinish(c.finish, c.foil),
      collectorsNumber: c.collectorsNumber ?? match.collector_number,
      count: c.count,
      color: match?.colors ?? [],
      colorIdentity: match?.color_identity ?? [],
      normalizedName: normalizeName(c.name),
      versionLabel: match ? getVersionLabel(match) : "",
      legalities: match.legalities,
    };
  }),
});

const loadBox = async (
  settings: AppSettings,
  name: string,
  cardIndex: CardIndex
): Promise<Box> => {
  const path = getBoxPath(settings, name);
  const exists = fs.existsSync(path);

  if (!exists) {
    throw Error(`Box not found: ${name}`);
  }

  const buffer = await fs.promises.readFile(path);
  const json = buffer.toString();
  const box: FileBox = JSON.parse(json);
  return fromFileBox(box, cardIndex);
};

export const inventoryReadProvider: InventoryReadProvider = {
  loadBoxInfos,
  loadBox,
};
