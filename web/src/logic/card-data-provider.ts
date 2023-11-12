import { CardDataProvider } from "leng-core/src/domain/interfaces";
import { Card, Set } from "leng-core/src/domain/encyclopedia";

const dir = "../../data/encyclopedia";

const loadFile = async <T>(file: string): Promise<T[]> => {
  const path = `${dir}/${file}.json`;
  console.log(`loadFile ${file}`);

  const storageKey = `encyclopedia-${file}-last-modified`;

  let lastModified = localStorage.getItem(storageKey);
  const request = new Request(path);
  if (lastModified) {
    request.headers.set("If-Modified-Since", lastModified);
  }

  const response = await fetch(request);

  lastModified = response.headers.get("last-modified");
  if (lastModified) {
    console.log("updating last modified date");
    localStorage.setItem(storageKey, lastModified);
  }

  console.log(`decoding ${file} JSON...`);
  const data: T[] = await response.json();

  console.log(`decoded ${data.length} ${file}`);
  return data;
};

const getAllCards = () => loadFile<Card>("cards");

const getAllSets = () => loadFile<Set>("sets");

export const cardDataProvider: CardDataProvider = {
  getAllCards,
  getAllSets,
};
