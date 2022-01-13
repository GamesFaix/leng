import { Card } from 'scryfall-api';
import * as fs from 'fs';

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

const dataPath = '/cards.json';

async function getDataCreatedDate() : Promise<Date | null> {
    try {
        const stats = await fs.promises.stat(dataPath);
        console.log(stats);
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
    console.log(bulkDataResponse);
    const defaultCardsInfo = bulkDataResponse.data.find(x => x.type === "default_cards");

    const httpResponse2 = await fetch(defaultCardsInfo.download_uri);
    return httpResponse2.text();
}

async function saveData(json: string) : Promise<void> {
    return fs.promises.writeFile(dataPath, json);
}

async function loadData() : Promise<string> {
    const buffer = await fs.promises.readFile(dataPath);
    return buffer.toString();
}

function parseData(json: string) : Card[] {
    return JSON.parse(json);
}

export async function loadCards() : Promise<Card[]> {
    const dataCreatedDate = await getDataCreatedDate();
    if (isDataStale(dataCreatedDate)) {
        const data = await downloadData();
        console.log(data);
        await saveData(data);
        return parseData(data);
    }
    else {
        const data = await loadData();
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

