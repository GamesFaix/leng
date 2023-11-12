import { Card, Set } from "leng-core/src/domain/encyclopedia";
import * as fs from "fs";
import { createFileAndDirectoryIfRequired } from "../file-system/file-helpers";
import { AppSettings } from "leng-core/src/domain/config";
import { CardDataProvider } from "leng-core/src/domain/interfaces";
import * as Scryfall from "leng-core/src/domain/scryfall";

async function getFileCreatedDate(path: string): Promise<Date | null> {
  try {
    const stats = await fs.promises.stat(path);
    return stats.mtime;
  } catch {
    return null;
  }
}

const dataRetentionDays = 7;

function isExpired(createdDate: Date | null) {
  if (createdDate === null) {
    return true;
  }

  const today = new Date();
  const oldestAllowedDate = new Date(today);
  oldestAllowedDate.setDate(oldestAllowedDate.getDate() - dataRetentionDays);

  return createdDate < oldestAllowedDate;
}

async function readFile(path: string): Promise<string> {
  const buffer = await fs.promises.readFile(path);
  return buffer.toString();
}

async function readOrDownloadJsonFile<T>(
  settings: AppSettings,
  fileName: string,
  download: () => Promise<T>
): Promise<T> {
  const path = `${settings.dataPath}/encyclopedia/${fileName}.json`;
  const createdDate = await getFileCreatedDate(path);

  if (isExpired(createdDate)) {
    const data = await download();
    const json = JSON.stringify(data);
    createFileAndDirectoryIfRequired(path, json);
    return data;
  } else {
    const json = await readFile(path);
    return JSON.parse(json) as T;
  }
}

const getAllCards = (settings: AppSettings) =>
  readOrDownloadJsonFile<Card[]>(settings, "cards", Scryfall.getAllCards);
const getAllSets = (settings: AppSettings) =>
  readOrDownloadJsonFile<Set[]>(settings, "sets", Scryfall.getAllSets);

export const cardDataProvider: CardDataProvider = {
  getAllCards,
  getAllSets,
};
