import * as fs from "fs";
import {
  AppSettings,
  Box,
  CardFinish,
  CardIndex,
  FileBox,
} from "leng-core/src/logic/model";
import { InventoryWriteProvider } from "leng-core/src/logic/interfaces";
import { getBoxPath } from "./inventory-common";
import { inventoryReadProvider } from "./inventory-read-provider";

const toFileBox = (box: Box): FileBox => ({
  name: box.name,
  lastModified: box.lastModified,
  description: box.description,
  cards: box.cards.map((c) => {
    return {
      name: c.name,
      setAbbrev: c.setAbbrev,
      scryfallId: c.scryfallId,
      lang: c.lang,
      finish: c.finish,
      foil: c.finish !== CardFinish.Normal,
      collectorsNumber: c.collectorsNumber,
      count: c.count,
    };
  }),
});

const saveBox = async (
  settings: AppSettings,
  box: Box,
  overwrite: boolean
): Promise<void> => {
  const path = getBoxPath(settings, box.name);
  const exists = fs.existsSync(path);
  if (exists) {
    if (overwrite) {
      await fs.promises.rm(path);
    } else {
      throw Error(`Box already exists: ${box.name}`);
    }
  }

  const fileBox = toFileBox(box);
  const json = JSON.stringify(fileBox);
  await fs.promises.writeFile(path, json);
};

const renameBox = async (
  settings: AppSettings,
  oldName: string,
  newName: string,
  cardIndex: CardIndex
): Promise<void> => {
  const oldPath = getBoxPath(settings, oldName);
  const newPath = getBoxPath(settings, newName);

  if (fs.existsSync(newPath)) {
    throw `Box named ${newName} already exists.`;
  }

  let box: Box = await inventoryReadProvider.loadBox(
    settings,
    oldName,
    cardIndex
  );
  box = { ...box, name: newName };

  await saveBox(settings, box, true);

  fs.rmSync(oldPath);
};

const deleteBox = async (
  settings: AppSettings,
  name: string
): Promise<void> => {
  const path = getBoxPath(settings, name);
  if (fs.existsSync(path)) {
    fs.rmSync(path);
  }
};

export const inventoryWriteProvider: InventoryWriteProvider = {
  saveBox,
  renameBox,
  deleteBox,
};
