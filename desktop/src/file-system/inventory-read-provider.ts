import * as fs from "fs";
import { orderBy } from "lodash";
import { parse } from "path";
import { createDirIfMissing } from "./file-helpers";
import {
  AppSettings,
  Box,
  BoxInfo,
  CardIndex,
  FileBox,
} from "leng-core/src/logic/model";
import { InventoryReadProvider } from "leng-core/src/logic/interfaces";
import { getBoxPath, getInventoryDir } from "./inventory-common";
import { fromFileBox } from "leng-core/src/logic/inventory";

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
