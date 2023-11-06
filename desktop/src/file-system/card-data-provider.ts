import { CardDataProvider } from "leng-core/src/logic/interfaces";
import { AppSettings } from "leng-core/src/logic/model";
import { Card, Set } from "scryfall-api";
import * as fs from "fs";
import { createFileAndDirectoryIfRequired } from "../file-system/file-helpers";

type BulkData = {
  object: string;
  id: string;
  type: string;
  updatedAt: string;
  uri: string;
  name: string;
  description: string;
  compressed_size: number;
  download_uri: string;
  content_type: string;
  content_encoding: string;
};

type ScryfallResponse<T> = {
  object: string;
  has_more: boolean;
  data: T;
};

const baseUrl = "https://api.scryfall.com";

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

async function downloadCardsData(): Promise<string> {
  const httpResponse1 = await fetch(`${baseUrl}/bulk-data`);
  const scryfallResponse: ScryfallResponse<BulkData[]> =
    await httpResponse1.json();
  const defaultCardsInfo = scryfallResponse.data.find(
    (x) => x.type === "default_cards"
  );
  if (!defaultCardsInfo) {
    throw Error("Could not find bulk data file info.");
  }
  const httpResponse2 = await fetch(defaultCardsInfo.download_uri);
  return httpResponse2.text();
}

async function downloadSetsData(): Promise<string> {
  const httpResponse = await fetch(`${baseUrl}/sets`);
  const scryfallResponse: ScryfallResponse<Set[]> = await httpResponse.json();
  return JSON.stringify(scryfallResponse.data);
}

async function readFile(path: string): Promise<string> {
  const buffer = await fs.promises.readFile(path);
  return buffer.toString();
}

async function readOrDownloadJsonFile<T>(
  settings: AppSettings,
  fileName: string,
  download: () => Promise<string>
): Promise<T> {
  const path = `${settings.dataPath}/encyclopedia/${fileName}.json`;
  const createdDate = await getFileCreatedDate(path);

  let dataJson: string;
  if (isExpired(createdDate)) {
    dataJson = await download();
    createFileAndDirectoryIfRequired(path, dataJson);
  } else {
    dataJson = await readFile(path);
  }

  return JSON.parse(dataJson) as T;
}

const getAllCards = async (settings: AppSettings) => {
  const cards = await readOrDownloadJsonFile<Card[]>(
    settings,
    "cards",
    downloadCardsData
  );
  return cards.filter((c) => !c.digital); // Filter out MTGO sets
};

const getAllSets = async (settings: AppSettings) => {
  return await readOrDownloadJsonFile<Set[]>(
    settings,
    "sets",
    downloadSetsData
  );
};

export const cardDataProvider: CardDataProvider = {
  getAllCards,
  getAllSets,
};
