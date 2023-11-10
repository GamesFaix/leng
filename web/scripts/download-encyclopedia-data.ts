import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { getAllCards, getAllSets } from "leng-core/src/domain/scryfall";

const dir = dirname(resolve(__dirname, `../dist/data/encyclopedia`));

const downloadCards = async () => {
  console.log("Downloading card data...");
  const cards = await getAllCards();
  const path = resolve(dir, "cards.json");
  console.log(`Saving card data to ${path}...`);
  const json = JSON.stringify(cards);
  writeFileSync(path, json);
};

const downloadSets = async () => {
  console.log("Downloading set data...");
  const sets = await getAllSets();
  const path = resolve(dir, "sets.json");
  console.log(`Saving set data to ${path}...`);
  const json = JSON.stringify(sets);
  writeFileSync(path, json);
};

const downloadData = async () => {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  await downloadCards();
  await downloadSets();
};

downloadData().catch(console.error);
