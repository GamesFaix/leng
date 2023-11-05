import { AppSettings, Box, BoxInfo, CardIndex } from "./model";
import { TappedOutCsvExportCard } from "./tappedout-csv-export";

export interface InventoryReadProvider {
    loadBoxInfos : (settings: AppSettings) => Promise<BoxInfo[]>,
    loadBox : (settings: AppSettings, name: string, cardIndex: CardIndex) => Promise<Box>,
}

export interface InventoryWriteProvider {
    saveBox: (settings: AppSettings, box: Box, overwrite: boolean) => Promise<void>,
    renameBox: (settings: AppSettings, oldName: string, newName: string, cardIndex: CardIndex) => Promise<void>
    deleteBox: (settings: AppSettings, name: string) => Promise<void>
}

export interface TappedOutCsvExportProvider {
    exportCards: (settings: AppSettings, cards: TappedOutCsvExportCard[]) => Promise<void>
}