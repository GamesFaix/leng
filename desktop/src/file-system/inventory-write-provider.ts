import * as fs from "fs";
import { getBoxPath } from "./inventory-common";
import { inventoryReadProvider } from "./inventory-read-provider";
import { AppSettings } from "leng-core/src/domain/config";
import { CardIndex } from "leng-core/src/domain/encyclopedia";
import { InventoryWriteProvider } from "leng-core/src/domain/interfaces";
import { toFileBox } from "leng-core/src/domain/inventory-files";
import { Box } from "leng-core/src/domain/inventory";

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
