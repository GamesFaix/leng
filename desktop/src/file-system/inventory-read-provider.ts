import * as fs from "fs";
import { orderBy } from "lodash";
import { parse } from "path";
import { createDirIfMissing } from "./file-helpers";
import { AppSettings } from "leng-core/src/domain/config";
import { CardIndex } from "leng-core/src/domain/encyclopedia";
import { InventoryReadProvider } from "leng-core/src/domain/interfaces";
import { Box, BoxInfo } from "leng-core/src/domain/inventory";
import { FileBox, fromFileBox } from "leng-core/src/domain/inventory-files";
import { getInventoryDir, getBoxPath } from "./inventory-common";

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
