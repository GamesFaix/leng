import * as fs from 'fs';
import { call, put, select, takeLeading, } from "redux-saga/effects";
import { Card, Set } from 'scryfall-api';
import { createDirForFileIfMissing, createFileAndDirectoryIfRequired } from '../logic/file-helpers';
import { AppSettings, AsyncRequestStatus } from "../logic/model";
import { encyclopediaActions, EncyclopediaActionTypes, EncyclopediaLoadAction } from "../store/encyclopedia";
import selectors from '../store/selectors';

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

type ScryfallResponse<T> = {
    object: string,
    has_more: boolean,
    data: T
}

const baseUrl = "https://api.scryfall.com";

async function getFileCreatedDate(path: string) : Promise<Date | null> {
    try {
        const stats = await fs.promises.stat(path);
        return stats.mtime;
    }
    catch {
        return null;
    }
}

const dataRetentionDays = 7;

function isExpired(createdDate: Date | null) {
    if (createdDate === null) { return true; }

    const today = new Date();
    const oldestAllowedDate = new Date(today);
    oldestAllowedDate.setDate(oldestAllowedDate.getDate() - dataRetentionDays);

    return createdDate < oldestAllowedDate;
}

async function downloadCardsData() : Promise<string> {
    const httpResponse1 = await fetch(`${baseUrl}/bulk-data`);
    const scryfallResponse : ScryfallResponse<BulkData[]> = await httpResponse1.json();
    const defaultCardsInfo = scryfallResponse.data.find(x => x.type === "default_cards");
    if (!defaultCardsInfo) { throw Error('Could not find bulk data file info.'); }
    const httpResponse2 = await fetch(defaultCardsInfo.download_uri);
    return httpResponse2.text();
}

async function downloadSetsData() : Promise<string> {
    const httpResponse = await fetch(`${baseUrl}/sets`);
    const scryfallResponse : ScryfallResponse<Set[]> = await httpResponse.json();
    return JSON.stringify(scryfallResponse.data);
}

async function readFile(path: string) : Promise<string> {
    const buffer = await fs.promises.readFile(path);
    return buffer.toString();
}

async function readOrDownloadJsonFile<T>(
    settings: AppSettings,
    fileName: string,
    download: () => Promise<string>)
    : Promise<T> {

    const path = `${settings.dataPath}/encyclopedia/${fileName}.json`;
    const createdDate = await getFileCreatedDate(path);

    let dataJson : string;
    if (isExpired(createdDate)) {
        dataJson = await download();
        createFileAndDirectoryIfRequired(path, dataJson);
    }
    else {
        dataJson = await readFile(path);
    }

    return JSON.parse(dataJson) as T;
}

async function loadCards(settings: AppSettings) : Promise<Card[]> {
    const cards = await readOrDownloadJsonFile<Card[]>(settings, "cards", downloadCardsData);
    return cards.filter(c => !c.digital); // Filter out MTGO sets
}

async function loadSets(settings: AppSettings) : Promise<Set[]> {
    return await readOrDownloadJsonFile<Set[]>(settings, "sets", downloadSetsData);
}

export function getSetSymbolImagePath(settings: AppSettings, setAbbrev: string) : string {
    // Need "set-" prefix to avoid naming Conflux icon "con", which is a reserved name in Windows
    return `${settings.dataPath}/encyclopedia/setSymbols/set-${setAbbrev}.svg`;
}

async function downloadFile(fromUrl: string, toPath: string) {
    const response = await fetch(fromUrl);
    const buffer = await response.arrayBuffer();
    const data = new Uint8Array(buffer);
    createDirForFileIfMissing(toPath);
    await fs.promises.writeFile(toPath, data);
}

async function downloadSetSymbol(settings: AppSettings, set: Set) : Promise<void> {
    const path = getSetSymbolImagePath(settings, set.code);
    await downloadFile(set.icon_svg_uri, path);
}

async function downloadSetSymbolIfMissing(settings: AppSettings, set: Set) : Promise<void> {
    const path = getSetSymbolImagePath(settings, set.code);
    const createdDate = await getFileCreatedDate(path);

    if (isExpired(createdDate)){
        await downloadSetSymbol(settings, set);
    }
    else {
        return;
    }
}

function* loadEncyclopedia(action: EncyclopediaLoadAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings : AppSettings = yield select(selectors.settings);
        const cards : Card[] = yield call(() => loadCards(settings));
        const sets : Set[] = yield call(() => loadSets(settings));
        for (const s of sets) {
            yield call(() => downloadSetSymbolIfMissing(settings, s));
        }
        yield put(encyclopediaActions.loadSuccess(cards));
    }
    catch (error) {
        yield put(encyclopediaActions.loadError(`${error}`));
    }
}

function* encyclopediaSaga() {
    yield takeLeading(EncyclopediaActionTypes.Load, loadEncyclopedia);
}
export default encyclopediaSaga;