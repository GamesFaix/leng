import { Card, Set } from "scryfall-api";
import { AppSettings, Box, BoxInfo, CardIndex } from "./model";
import { TappedOutCsvExportCard } from "./tappedout-csv-export";

export interface InventoryReadProvider {
  loadBoxInfos: (settings: AppSettings) => Promise<BoxInfo[]>;
  loadBox: (
    settings: AppSettings,
    name: string,
    cardIndex: CardIndex
  ) => Promise<Box>;
}

export interface InventoryWriteProvider {
  saveBox: (
    settings: AppSettings,
    box: Box,
    overwrite: boolean
  ) => Promise<void>;
  renameBox: (
    settings: AppSettings,
    oldName: string,
    newName: string,
    cardIndex: CardIndex
  ) => Promise<void>;
  deleteBox: (settings: AppSettings, name: string) => Promise<void>;
}

export interface TappedOutCsvExportProvider {
  exportCards: (
    settings: AppSettings,
    cards: TappedOutCsvExportCard[]
  ) => Promise<void>;
}

export interface SettingsProvider {
  load: () => AppSettings;
  save: (settings: AppSettings) => void;
}

export interface CardDataProvider {
  getAllCards: (settings: AppSettings) => Promise<Card[]>;
  getAllSets: (settings: AppSettings) => Promise<Set[]>;
}

export interface ImagePathProvider {
  getSetSymbolPath: (settings: AppSettings, setCode: string) => string;
  getCardImagePath: (settings: AppSettings, card: Card) => string;
}

export interface ImageDownloader {
  downloadCardImage: (settings: AppSettings, card: Card) => Promise<void>;
  downloadSetSymbol: (settings: AppSettings, set: Set) => Promise<void>;
}

export interface ExternalLinkProvider {
  openLink: (url: string) => void
}