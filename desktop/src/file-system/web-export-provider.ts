import { InventoryWebExportProvider } from "leng-core/src/domain/interfaces";
import { Inventory } from "leng-core/src/domain/inventory-files";
import { AppSettings } from "leng-core/src/domain/config";
import { utc } from "moment";
import { writeFileSync } from "fs";

const exportCards = async (
  settings: AppSettings,
  inventory: Inventory
): Promise<void> => {
  const json = JSON.stringify(inventory);
  const timestamp = utc().format("YYYY-MM-DD-HH-mm-ss");
  const path = `${settings.dataPath}/web-export-${timestamp}.json`;
  writeFileSync(path, json);
};

export const inventoryWebExportProvider: InventoryWebExportProvider = {
  exportCards,
};
