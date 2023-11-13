import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { getAllCards, getAllSets } from "leng-core/src/domain/scryfall";
import { gzip } from "node-gzip";

const dir = resolve(__dirname, "../dist/data/encyclopedia");

const downloadFile = async <T>(
  fileName: string,
  getData: () => Promise<T[]>
) => {
  console.log(`Downloading ${fileName} data...`);
  const data = await getData();
  console.log(`Found ${data.length} ${fileName}.`);

  const file = resolve(`${dir}/${fileName}`);
  console.log(`Saving ${fileName} data to ${file}.json...`);
  const json = JSON.stringify(data);
  writeFileSync(`${file}.json`, json);

  console.log("Saving zipped");
  const zip = await gzip(json);
  writeFileSync(`${file}.json.gz`, zip);
};

const downloadCards = () => downloadFile("cards", getAllCards);

const downloadSets = () => downloadFile("sets", getAllSets);

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
