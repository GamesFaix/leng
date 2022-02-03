import * as fs from 'fs';
import { orderBy } from 'lodash';
import { parse } from 'path';
import { call, put, select, takeEvery, takeLeading } from "redux-saga/effects";
import { Card } from 'scryfall-api';
import { createDirIfMissing } from '../logic/file-helpers';
import { AppSettings, AsyncRequestStatus, Box, BoxInfo, Language } from "../logic/model";
import { RootState } from '../store';
import { BoxCreateAction, BoxDeleteAction, BoxInfosLoadAction, BoxLoadAction, BoxRenameAction, BoxSaveAction, inventoryActions, InventoryActionTypes } from "../store/inventory";

function getInventoryDir(settings: AppSettings) : string {
    return `${settings.dataPath}/inventory`;
}

function getBoxPath(settings: AppSettings, name: string) : string {
    return `${getInventoryDir(settings)}/${name}.json`;
}

async function loadBoxInfosInner(settings: AppSettings) : Promise<BoxInfo[]> {
    const dir = getInventoryDir(settings);
    createDirIfMissing(dir);
    let files = await fs.promises.readdir(dir);
    files = orderBy(files, f => f.toLowerCase());

    const promises = files.map(async f => {
        const stats = await fs.promises.stat(`${dir}/${f}`);
        return {
            name: parse(f).name,
            lastModified: stats.mtime
        };
    });

    return Promise.all(promises);
}

function* loadBoxInfos(action: BoxInfosLoadAction) {
    if (action.value.status !== AsyncRequestStatus.Started) { return; }

    try {
        const settings : AppSettings = yield select((state: RootState) => state.settings.settings);
        const boxInfos : BoxInfo[] = yield call(() => loadBoxInfosInner(settings));
        yield put(inventoryActions.boxInfosLoadSuccess(boxInfos));
        for (let b of boxInfos) {
            yield put(inventoryActions.boxLoadStart(b.name));
        }
    }
    catch (error) {
        yield put(inventoryActions.boxInfosLoadFailure(`${error}`));
    }
}

async function loadBoxInner(settings: AppSettings, name: string, encyclopediaCards: Card[]) : Promise<Box> {
    const path = getBoxPath(settings, name);
    const exists = fs.existsSync(path);

    if (!exists) {
        throw Error(`Box not found: ${name}`);
    }

    const buffer = await fs.promises.readFile(path);
    const json = buffer.toString();
    const box: Box = JSON.parse(json);
    box.cards.forEach(c => {
        if (!c.lang) {
            c.lang = Language.English
        }
        c.details = encyclopediaCards.find(ec => ec.id === c.scryfallId) ?? null;
    });
    return box;
}

function* loadBox(action: BoxLoadAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings : AppSettings = yield select((state: RootState) => state.settings.settings);
        const encyclopediaCards : Card[] = yield select((state: RootState) => state.encyclopedia.cards);
        const name = action.value.data;
        const box : Box = yield call(() => loadBoxInner(settings, name, encyclopediaCards));
        yield put(inventoryActions.boxLoadSuccess(box));
    }
    catch (error) {
        yield put(inventoryActions.boxLoadFailure(`${error}`));
    }
}

async function saveBoxInner(settings: AppSettings, box: Box, overwrite: boolean) : Promise<void> {
    const path = getBoxPath(settings, box.name);
    const exists = fs.existsSync(path);
    if (exists) {
        if (overwrite) {
            await fs.promises.rm(path);
        } else {
            throw Error(`Box already exists: ${box.name}`);
        }
    }
    const sanitized : Box = {
        ...box,
        cards: box.cards.map(c => {
            return {
                ...c,
                details: null
            };
        })
    };
    const json = JSON.stringify(sanitized);

    await fs.promises.writeFile(path, json);
}

function* saveBox(action: BoxSaveAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings : AppSettings = yield select((state: RootState) => state.settings.settings);
        const box = {
            ...action.value.data,
            lastModified: new Date()
        };
        yield call(() => saveBoxInner(settings, box, true));
        yield put(inventoryActions.boxSaveSuccess(box));
    }
    catch (error) {
        yield put(inventoryActions.boxSaveFailure(`${error}`));
    }
}

function* renameBox(action: BoxRenameAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings : AppSettings = yield select((state: RootState) => state.settings.settings);
        const encyclopediaCards : Card[] = yield select((state: RootState) => state.encyclopedia.cards);
        const [oldName, newName] = action.value.data;
        const oldPath = getBoxPath(settings, oldName);
        const newPath = getBoxPath(settings, newName);

        if (fs.existsSync(newPath)) {
            throw `Box named ${newName} already exists.`;
        }

        let box : Box = yield call(() => loadBoxInner(settings, oldName, encyclopediaCards));
        box = { ...box, name: newName };

        yield call(() => saveBoxInner(settings, box, true));

        fs.rmSync(oldPath);

        yield put(inventoryActions.boxRenameSuccess(oldName, newName));
    }
    catch (error) {
        yield put(inventoryActions.boxRenameFailure(`${error}`));
    }
}

function* createBox(action: BoxCreateAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings : AppSettings = yield select((state: RootState) => state.settings.settings);
        const box: Box = {
            name: action.value.data,
            description: '',
            cards: [],
            lastModified: new Date()
        };

        yield call(() => saveBoxInner(settings, box, false));
        yield put(inventoryActions.boxCreateSuccess(box));
    }
    catch (error) {
        yield put(inventoryActions.boxCreateFailure(`${error}`));
    }
}

function* deleteBox(action: BoxDeleteAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings : AppSettings = yield select((state: RootState) => state.settings.settings);
        const name = action.value.data;
        const path = getBoxPath(settings, name);
        const exists = fs.existsSync(path);

        if (exists) {
            fs.rmSync(path);
        }

        yield put(inventoryActions.boxDeleteSuccess(name));
    }
    catch (error) {
        yield put(inventoryActions.boxDeleteFailure(`${error}`));
    }
}

function* inventorySaga() {
    yield takeLeading(InventoryActionTypes.BoxInfosLoad, loadBoxInfos);
    yield takeEvery(InventoryActionTypes.BoxLoad, loadBox);
    yield takeEvery(InventoryActionTypes.BoxSave, saveBox);
    yield takeEvery(InventoryActionTypes.BoxRename, renameBox);
    yield takeEvery(InventoryActionTypes.BoxCreate, createBox);
    yield takeEvery(InventoryActionTypes.BoxDelete, deleteBox);
}
export default inventorySaga;