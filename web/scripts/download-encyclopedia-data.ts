import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { getAllCards, getAllSets } from "leng-core/src/domain/scryfall";

const dir = resolve(__dirname, "../dist/data/encyclopedia");

const downloadCards = async () => {
  console.log("Downloading card data...");
  const cards = await getAllCards();
  console.log(`Found ${cards.length} cards.`);
  const path = resolve(`${dir}/cards.json`);
  console.log(`Saving card data to ${path}...`);
  const json = JSON.stringify(cards);
  writeFileSync(path, json);
};

const downloadSets = async () => {
  console.log("Downloading set data...");
  const sets = await getAllSets();
  console.log(`Found ${sets.length} sets.`);
  const path = resolve(`${dir}/sets.json`);
  console.log(`Saving set data to ${path}...`);
  const json = JSON.stringify(sets);
  writeFileSync(path, json);
};

const downloadData = async () => {
  console.log(`Downloading encyclopedia to ${resolve(dir)}...`);
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  await downloadCards();
  await downloadSets();
};

downloadData().catch(console.error);
