import { InventoryWebExportProvider,  } from "leng-core/src/logic/interfaces";
import { Inventory } from "leng-core/src/logic/inventory";
import { AppSettings } from "leng-core/src/logic/model";
import * as moment from "moment";
import * as fs from 'fs'

const exportCards = async (
  settings: AppSettings,
  inventory: Inventory
): Promise<void> => {
    const json = JSON.stringify(inventory);
    const timestamp = moment.utc().format("YYYY-MM-DD-HH-mm-ss");
    const path = `${settings.dataPath}/web-export-${timestamp}.json`
    fs.writeFileSync(path, json);
};

export const inventoryWebExportProvider: InventoryWebExportProvider = {
  exportCards,
};
