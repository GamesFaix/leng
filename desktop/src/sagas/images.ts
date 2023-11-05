import * as fs from 'fs';
import { call, put, select, takeEvery, } from "redux-saga/effects";
import { Card, Set } from 'scryfall-api';
import { createDirForFileIfMissing } from '../file-system/file-helpers';
import { AppSettings, AsyncRequestStatus, normalizeName } from "leng-core/src/logic/model";
import { RootState } from 'leng-core/src/store';
import { encyclopediaActions, EncyclopediaActionTypes, LoadCardImageAction, LoadSetSymbolAction } from "leng-core/src/store/encyclopedia";
import selectors from 'leng-core/src/store/selectors';

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


export function getSetSymbolImagePath(settings: AppSettings, setAbbrev: string) : string {
    // Need "set-" prefix to avoid naming Conflux icon "con", which is a reserved name in Windows
    return `${settings.dataPath}/encyclopedia/setSymbols/set-${setAbbrev}.svg`;
}

export function getCardImagePath(settings: AppSettings, card: Card) : string {
    return `${settings.dataPath}/encyclopedia/cardImages/set-${card.set}/${normalizeName(card.name)}-${card.collector_number}.jpg`;
}

async function downloadFile(fromUrl: string, toPath: string) {
    const response = await fetch(fromUrl);
    const buffer = await response.arrayBuffer();
    const data = new Uint8Array(buffer);
    createDirForFileIfMissing(toPath);
    await fs.promises.writeFile(toPath, data);
}

async function downloadFileIfMissing(localPath: string, sourceUrl: string) : Promise<void> {
    if (!fs.existsSync(localPath)) {
        // createDirForFileIfMissing(localPath); // TODO: This isn't working, folder must pre-exist!
        await downloadFile(sourceUrl, localPath);
    }
}

async function downloadSetSymbolIfMissing(settings: AppSettings, set: Set) : Promise<void> {
    const path = getSetSymbolImagePath(settings, set.code);
    const uri = set.icon_svg_uri;
    return downloadFileIfMissing(path, uri);
}

async function downloadCardImageIfMissing(settings: AppSettings, card: Card) : Promise<void> {
    const path = getCardImagePath(settings, card);
    const uri = card.image_uris?.small ?? card.image_uris?.normal ?? card.image_uris?.large ?? card.image_uris?.png ?? '';
    return downloadFileIfMissing(path, uri);
}


function* loadSetSymbol(action: LoadSetSymbolAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const setAbbrev = action.value.data;
        const settings : AppSettings = yield select(selectors.settings);
        const set: Set = yield select(selectors.set(setAbbrev));
        yield call(() => downloadSetSymbolIfMissing(settings, set));
        yield put(encyclopediaActions.loadSetSymbolSuccess(setAbbrev));
    }
    catch (error) {
        yield put(encyclopediaActions.loadSetSymbolError(`${error}`));
    }
}

function* loadCardImage(action: LoadCardImageAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const scryfallId = action.value.data;
        const settings : AppSettings = yield select(selectors.settings);
        const card: Card = yield select((state: RootState) => state.encyclopedia.cardIndex[scryfallId])
        yield call(() => downloadCardImageIfMissing(settings, card));
        yield put(encyclopediaActions.loadCardImageSuccess(scryfallId));
    }
    catch (error) {
        yield put(encyclopediaActions.loadCardImageError(`${error}`));
    }
}

function* imagesSaga() {
    yield takeEvery(EncyclopediaActionTypes.LoadSetSymbol, loadSetSymbol);
    yield takeEvery(EncyclopediaActionTypes.LoadCardImage, loadCardImage);
}
export default imagesSaga;