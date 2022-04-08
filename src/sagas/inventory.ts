import * as fs from 'fs';
import { orderBy } from 'lodash';
import { parse } from 'path';
import { call, put, select, takeEvery, takeLeading } from "redux-saga/effects";
import { getCards } from '../logic/card-filters';
import { toCsvCards } from '../logic/csv-model';
import { createDirIfMissing } from '../logic/file-helpers';
import { AppSettings, AsyncRequestStatus, Box, BoxCard, BoxCardModule, BoxInfo, CardIndex, defaultCardFilter, FileBox, getVersionLabel, Language, normalizeName } from "../logic/model";
import { BoxCreateAction, BoxDeleteAction, BoxInfosLoadAction, BoxLoadAction, BoxRenameAction, BoxSaveAction, BoxState, BoxTransferBulkAction, BoxTransferSingleAction, CsvExportAction, inventoryActions, InventoryActionTypes } from "../store/inventory";
import selectors from '../store/selectors';

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
        const settings : AppSettings = yield select(selectors.settings);
        const boxInfos : BoxInfo[] = yield call(() => loadBoxInfosInner(settings));
        yield put(inventoryActions.boxInfosLoadSuccess(boxInfos));
    }
    catch (error) {
        yield put(inventoryActions.boxInfosLoadFailure(`${error}`));
    }
}

function fromFileBox(fileBox: FileBox, cardIndex: CardIndex) : Box {
    return {
        name: fileBox.name,
        lastModified: fileBox.lastModified,
        description: fileBox.description,
        cards: fileBox.cards.map(c => {
            const match = cardIndex[c.scryfallId];
            return {
                name: c.name,
                setAbbrev: c.setAbbrev,
                setName: match?.set_name ?? '',
                scryfallId: c.scryfallId,
                lang: c.lang ?? Language.English,
                foil: c.foil,
                collectorsNumber: c.collectorsNumber ?? match.collector_number,
                count: c.count,
                color: match?.colors ?? [],
                colorIdentity: match?.color_identity ?? [],
                normalizedName: normalizeName(c.name),
                versionLabel: match ? getVersionLabel(match) : ''
            };
        })
    };
}

async function loadBoxInner(settings: AppSettings, name: string, cardIndex: CardIndex) : Promise<Box> {
    const path = getBoxPath(settings, name);
    const exists = fs.existsSync(path);

    if (!exists) {
        throw Error(`Box not found: ${name}`);
    }

    const buffer = await fs.promises.readFile(path);
    const json = buffer.toString();
    const box: FileBox = JSON.parse(json);
    return fromFileBox(box, cardIndex);
}

function* loadBox(action: BoxLoadAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings : AppSettings = yield select(selectors.settings);
        const cardIndex : CardIndex = yield select(selectors.cardIndex);
        const name = action.value.data;
        const box : Box = yield call(() => loadBoxInner(settings, name, cardIndex));
        yield put(inventoryActions.boxLoadSuccess(box));
    }
    catch (error) {
        yield put(inventoryActions.boxLoadFailure(`${error}`));
    }
}

function toFileBox(box: Box) : FileBox {
    return {
        name: box.name,
        lastModified: box.lastModified,
        description: box.description,
        cards: box.cards.map(c => {
            return {
                name: c.name,
                setAbbrev: c.setAbbrev,
                scryfallId: c.scryfallId,
                lang: c.lang,
                foil: c.foil,
                collectorsNumber: c.collectorsNumber,
                count: c.count
            };
        })
    };
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

    const fileBox = toFileBox(box);
    const json = JSON.stringify(fileBox);
    await fs.promises.writeFile(path, json);
}

function* saveBox(action: BoxSaveAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings : AppSettings = yield select(selectors.settings);
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
        const settings : AppSettings = yield select(selectors.settings);
        const cardIndex: CardIndex = yield select(selectors.cardIndex);
        const [oldName, newName] = action.value.data;
        const oldPath = getBoxPath(settings, oldName);
        const newPath = getBoxPath(settings, newName);

        if (fs.existsSync(newPath)) {
            throw `Box named ${newName} already exists.`;
        }

        let box : Box = yield call(() => loadBoxInner(settings, oldName, cardIndex));
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
        const settings : AppSettings = yield select(selectors.settings);
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
        const settings : AppSettings = yield select(selectors.settings);
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

function* transferBulk(action: BoxTransferBulkAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings : AppSettings = yield select(selectors.settings);
        const boxes : BoxState[] = yield select(selectors.boxes);
        const request = action.value.data;
        const fromBox = boxes.find(b => b.name === request.fromBoxName);
        const toBox = boxes.find(b => b.name === request.toBoxName);
        if (!fromBox || !toBox) {
            throw "Box not found."
        }

        const cardsToTransfer = fromBox.cards?.filter(c => request.cardKeys.includes(BoxCardModule.getKey(c))) ?? [];
        const fromBoxCards = fromBox.cards?.filter(c => !request.cardKeys.includes(BoxCardModule.getKey(c))) ?? [];
        const toBoxCards = BoxCardModule.combineDuplicates(cardsToTransfer.concat(toBox.cards ?? []));

        const updatedFromBox : Box = {
            name: fromBox.name,
            description: fromBox.description ?? '',
            cards: fromBoxCards,
            lastModified: new Date()
        };

        const updatedToBox = {
            name: toBox.name,
            description: toBox.description ?? '',
            cards: toBoxCards,
            lastModified: new Date()
        };

        yield call(() => saveBoxInner(settings, updatedFromBox, true));
        yield call(() => saveBoxInner(settings, updatedToBox, true));

        const updatedBoxes : Box[] = [updatedFromBox, updatedToBox];

        yield put(inventoryActions.boxTransferBulkSuccess(updatedBoxes));
    }
    catch (error) {
        yield put(inventoryActions.boxTransferBulkFailure(`${error}`));
    }
}

function* transferSingle(action: BoxTransferSingleAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings : AppSettings = yield select(selectors.settings);
        const boxes : BoxState[] = yield select(selectors.boxes);
        const request = action.value.data;
        const fromBox = boxes.find(b => b.name === request.fromBoxName);
        const toBox = boxes.find(b => b.name === request.toBoxName);
        if (!fromBox || !toBox) {
            throw "Box not found."
        }

        const keyToTransfer = BoxCardModule.getKey(request.card);
        const fromBoxCards = BoxCardModule.removeZeroes(fromBox.cards?.map(c => {
            if (BoxCardModule.getKey(c) === keyToTransfer) {
                return { ...c, count: c.count - request.card.count }
            }
            else {
                return c;
            }
        }) ?? []);
        const toBoxCards = BoxCardModule.combineDuplicates([request.card].concat(toBox.cards ?? []));

        const updatedFromBox : Box = {
            name: fromBox.name,
            description: fromBox.description ?? '',
            cards: fromBoxCards,
            lastModified: new Date()
        };

        const updatedToBox = {
            name: toBox.name,
            description: toBox.description ?? '',
            cards: toBoxCards,
            lastModified: new Date()
        };

        yield call(() => saveBoxInner(settings, updatedFromBox, true));
        yield call(() => saveBoxInner(settings, updatedToBox, true));

        const updatedBoxes : Box[] = [updatedFromBox, updatedToBox];

        yield put(inventoryActions.boxTransferBulkSuccess(updatedBoxes));
    }
    catch (error) {
        yield put(inventoryActions.boxTransferBulkFailure(`${error}`));
    }
}

function* csvExport(action: CsvExportAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const boxes : Box[] = yield select(selectors.boxes);
        const cards = getCards(boxes, defaultCardFilter);
        const csvCards = toCsvCards(cards);
        // create csv file

        yield put(inventoryActions.csvExportSuccess());
    }
    catch (error) {
        yield put(inventoryActions.csvExportFailure(`${error}`));
    }
}

function* inventorySaga() {
    yield takeLeading(InventoryActionTypes.BoxInfosLoad, loadBoxInfos);
    yield takeEvery(InventoryActionTypes.BoxLoad, loadBox);
    yield takeEvery(InventoryActionTypes.BoxSave, saveBox);
    yield takeEvery(InventoryActionTypes.BoxRename, renameBox);
    yield takeEvery(InventoryActionTypes.BoxCreate, createBox);
    yield takeEvery(InventoryActionTypes.BoxDelete, deleteBox);
    yield takeEvery(InventoryActionTypes.BoxTransferBulk, transferBulk);
    yield takeEvery(InventoryActionTypes.BoxTransferSingle, transferSingle);
    yield takeEvery(InventoryActionTypes.CsvExport, csvExport);
}
export default inventorySaga;