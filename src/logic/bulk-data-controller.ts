import { Card } from 'scryfall-api';
import * as fs from 'fs';
import { AppSettings } from './settings-controller';
import { createFileAndDirectoryIfRequired } from './file-controller';

type BulkData = {
    object: string,
    id: string,
    type: string,
    updatedAt: string,
    uri: string,
    name: string,
    description: string,
    compressed_size: number,
    download_uri: string,
    content_type: string,
    content_encoding: string
}

type BulkDataResponse = {
    object: string,
    has_more: boolean,
    data: BulkData[]
}

async function getDataCreatedDate(path: string) : Promise<Date | null> {
    try {
        const stats = await fs.promises.stat(path);
        return stats.mtime;
    }
    catch {
        return null;
    }
}

function isDataStale(createdDate: Date | null) {
    if (createdDate === null) { return true; }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return createdDate < yesterday;
}

async function downloadData() : Promise<string> {
    const httpResponse1 = await fetch("https://api.scryfall.com/bulk-data");
    const bulkDataResponse : BulkDataResponse = await httpResponse1.json();
    const defaultCardsInfo = bulkDataResponse.data.find(x => x.type === "default_cards");
    if (!defaultCardsInfo) { throw Error('Could not find bulk data file info.'); }
    const httpResponse2 = await fetch(defaultCardsInfo.download_uri);
    return httpResponse2.text();
}

async function saveData(json: string, path: string) : Promise<void> {
    return fs.promises.writeFile(path, json);
}

async function loadData(path: string) : Promise<string> {
    const buffer = await fs.promises.readFile(path);
    return buffer.toString();
}

function parseData(json: string) : Card[] {
    return JSON.parse(json);
}

export async function loadCards(settings: AppSettings) : Promise<Card[]> {
    const path = `${settings.dataPath}/encyclopedia/cards.json`;
    const dataCreatedDate = await getDataCreatedDate(path);

    if (isDataStale(dataCreatedDate)) {
        const data = await downloadData();
        createFileAndDirectoryIfRequired(path, data);
        return parseData(data);
    }
    else {
        const data = await loadData(path);
        return parseData(data);
    }
}

export type FrameEffect =
    | 'legendary'
    | 'miracle'
    | 'nyxtouched'
    | 'draft'
    | 'devoid'
    | 'tombstone'
    | 'colorshifted'
    | 'inverted'
    | 'sunmoondfc'
    | 'compasslanddfc'
    | 'originpwdfc'
    | 'mooneldrazidfc'
    | 'moonreversemoondfc'
    | 'showcase'
    | 'extendedart'

