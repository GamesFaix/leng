import * as fs from 'fs';
import { call, put, select, takeLeading, } from "redux-saga/effects";
import { Card } from 'scryfall-api';
import { createFileAndDirectoryIfRequired } from '../logic/file-controller';
import { AppSettings, AsyncRequestStatus } from "../logic/model";
import { RootState } from "../store";
import { encyclopediaActions, EncyclopediaActionTypes, EncyclopediaLoadAction } from "../store/encyclopedia";

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

async function loadData(path: string) : Promise<string> {
    const buffer = await fs.promises.readFile(path);
    return buffer.toString();
}

function parseData(json: string) : Card[] {
    return JSON.parse(json);
}

async function loadCards(settings: AppSettings) : Promise<Card[]> {
    const path = `${settings.dataPath}/encyclopedia/cards.json`;
    const dataCreatedDate = await getDataCreatedDate(path);

    let dataJson : string;
    if (isDataStale(dataCreatedDate)) {
        dataJson = await downloadData();
        createFileAndDirectoryIfRequired(path, dataJson);
    }
    else {
        dataJson = await loadData(path);
    }

    let data = parseData(dataJson);
    data = data.filter(c => !c.digital); // Filter out MTGO sets
    return data;
}

function* loadEncyclopedia(action: EncyclopediaLoadAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings : AppSettings = yield select((state: RootState) => state.settings.settings);
        const cards : Card[] = yield call(() => loadCards(settings));
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