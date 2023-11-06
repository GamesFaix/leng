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

type Inventory = {
  boxes: FileBox[];
};

const defaultInventory: Inventory = {
  boxes: [],
};

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

const toBoxInfo = (box: FileBox): BoxInfo => ({
  name: box.name,
  lastModified: box.lastModified,
});

const loadBoxInfos = async (settings: AppSettings): Promise<BoxInfo[]> => {
  const inventory = await fetchInventoryCached(settings.dataPath);
  return inventory.boxes.map(toBoxInfo);
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
