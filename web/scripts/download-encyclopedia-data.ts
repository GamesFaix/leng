import * as fs from "fs";
import { resolve } from "path";
import { getAllCards, getAllSets } from "leng-core/src/domain/scryfall";
import { cardsPath, setsPath } from "../src/logic/card-data-provider";

const downloadCards = async () => {
  console.log("Downloading card data...");
  const cards = await getAllCards();
  const path = resolve(__dirname, `../${cardsPath}`);
  console.log(`Saving card data to ${path}...`);
  const json = JSON.stringify(cards);
  fs.writeFileSync(path, json);
};

const downloadSets = async () => {
  console.log("Downloading set data...");
  const sets = await getAllSets();
  const path = resolve(__dirname, `../${setsPath}`);
  console.log(`Saving set data to ${path}...`);
  const json = JSON.stringify(sets);
  fs.writeFileSync(path, json);
};

const downloadData = async () => {
  await downloadCards();
  await downloadSets();
};

downloadData().catch(console.error);
