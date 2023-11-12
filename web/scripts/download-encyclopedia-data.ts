import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { getAllCards, getAllSets } from "leng-core/src/domain/scryfall";
import { Card, Set } from "leng-core/src/domain/encyclopedia";

const dir = resolve(__dirname, "../dist/data/encyclopedia");

const downloadCards = async () => {
  console.log("Downloading card data...");
  const cards: Card[] = await getAllCards();
  console.log(`Found ${cards.length} cards.`);

  const path = resolve(`${dir}/cards.json`);
  console.log(`Saving card data to ${path}...`);
  const json = JSON.stringify(cards);

  writeFileSync(path, json);
};

const downloadSets = async () => {
  console.log("Downloading set data...");
  const sets: Set[] = await getAllSets();
  console.log(`Found ${sets.length} sets.`);

  const path = resolve(`${dir}/sets.json`);
  console.log(`Saving set data to ${path}...`);
  const json = JSON.stringify(sets);

  writeFileSync(path, json);
};

const makeDirIfMissing = (path: string) => {
  if (existsSync(path)) {
    console.log(`Directory ${path} already exists`);
  } else {
    console.log(`Creating directory ${path}`);
    mkdirSync(path, { recursive: true });
  }

  if (!existsSync(path)) {
    console.error(`Directory ${path} still doesn't exist!`);
  }
};

const downloadData = async () => {
  console.log(`Downloading encyclopedia to ${dir}...`);
  makeDirIfMissing(dir);
  await downloadCards();
  await downloadSets();
};

downloadData().catch((err) => {
  console.error(err);
  throw err;
});
