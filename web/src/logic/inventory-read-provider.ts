import { AppSettings } from "leng-core/src/domain/config";
import { CardIndex } from "leng-core/src/domain/encyclopedia";
import { InventoryReadProvider } from "leng-core/src/domain/interfaces";
import { Box, BoxInfo } from "leng-core/src/domain/inventory";
import { defaultInventory, Inventory, toBoxInfo, fromFileBox } from "leng-core/src/domain/inventory-files";

let cachedPath = "";
let cache = defaultInventory;

const fetchInventoryCached = async (path: string): Promise<Inventory> => {
  if (path === "") {
    console.log("fetchInventoryCached - returning default inventory");
    return defaultInventory;
  }

  if (cachedPath === path) {
    console.log(
      `fetchInventoryCached - returning cache of ${cache.boxes.length} boxes`
    );
    return cache;
  }

  console.log("fetching inventory JSON file...");
  const response = await fetch(path, { cache: "force-cache" });
  console.log("decoding JSON...");
  const inventory: Inventory = await response.json();
  cachedPath = path;
  cache = inventory;
  console.log(`found ${inventory.boxes.length} boxes`);
  return inventory;
};

const loadBoxInfos = async (settings: AppSettings): Promise<BoxInfo[]> => {
  console.log("loadBoxInfos");
  const inventory = await fetchInventoryCached(settings.dataPath);
  console.log("mapping boxes...");
  return inventory.boxes.map(toBoxInfo);
};

const loadBox = async (
  settings: AppSettings,
  name: string,
  cardIndex: CardIndex
): Promise<Box> => {
  console.log("loadBox");
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
