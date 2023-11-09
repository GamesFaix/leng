import { AppSettings } from "leng-core/src/domain/config";
import { cardDataProvider } from "./card-data-provider";
import * as fs from "fs";
import * as path from "path";

const downloadCards = async (settings: AppSettings) => {
  console.log("Downloading card data...");
  const cards = await cardDataProvider.getAllCards(settings);
  console.log("Saving card data...");
  const path = `${settings.dataPath}/cards.json`;
  const json = JSON.stringify(cards);
  fs.writeFileSync(path, json);
};

const downloadSets = async (settings: AppSettings) => {
  console.log("Downloading set data...");
  const sets = await cardDataProvider.getAllSets(settings);
  console.log("Saving set data...");
  const path = `${settings.dataPath}/sets.json`;
  const json = JSON.stringify(sets);
  fs.writeFileSync(path, json);
};

const downloadData = async () => {
  console.log("Updating Scryfall data...");
  const settings: AppSettings = {
    dataPath: path.resolve(__dirname, "../data"),
  };
  console.log(`Settings ${JSON.stringify(settings)}`);
  await downloadCards(settings);
  await downloadSets(settings);
};

downloadData().catch(console.error);
