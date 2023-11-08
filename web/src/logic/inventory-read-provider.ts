import {
  AppSettings,
  Box,
  BoxInfo,
  CardIndex,
} from "leng-core/src/logic/model";
import { InventoryReadProvider } from "leng-core/src/logic/interfaces";
import {
  Inventory,
  defaultInventory,
  fromFileBox,
  toBoxInfo,
} from "leng-core/src/logic/inventory";

let cachedPath = "";
let cache = defaultInventory;

const fetchInventoryCached = async (path: string): Promise<Inventory> => {
  if (path === "") {
    return defaultInventory;
  }

  if (cachedPath === path) {
    return cache;
  }

  const response = await fetch(path);
  const inventory: Inventory = await response.json();
  cachedPath = path;
  cache = inventory;
  return inventory;
};

const loadBoxInfos = async (settings: AppSettings): Promise<BoxInfo[]> => {
  const inventory = await fetchInventoryCached(settings.dataPath);
  return inventory.boxes.map(toBoxInfo);
};

const loadBox = async (
  settings: AppSettings,
  name: string,
  cardIndex: CardIndex
): Promise<Box> => {
  const inventory = await fetchInventoryCached(settings.dataPath);
  const filebox = inventory.boxes.find((b) => b.name === name);

  if (!filebox) {
    throw Error(`Box not found: ${name}`);
  }

  return fromFileBox(filebox, cardIndex);
};

export const inventoryReadProvider: InventoryReadProvider = {
  loadBoxInfos,
  loadBox,
};
