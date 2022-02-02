import { AppSettings } from "./model";
import * as fs from 'fs';
import { createDirIfMissing } from "./file-controller";
import { parse } from 'path';
import { InventoryAction, InventoryActionTypes } from "../store/inventory";
import { Box, BoxCardModule, BoxInfo, normalizeName } from "./model";
import { groupBy, orderBy } from "lodash";

function getInventoryDir(settings: AppSettings) : string {
    return `${settings.dataPath}/inventory`;
}

function getBoxPath(settings: AppSettings, name: string) : string {
    return `${getInventoryDir(settings)}/${name}.json`;
}

export async function getBoxInfos(settings: AppSettings) : Promise<BoxInfo[]> {
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

export async function createBox(settings: AppSettings, name: string, dispatch: (action:InventoryAction) => void) : Promise<BoxInfo> {
    const box: Box = {
        name,
        description: '',
        cards: [],
        lastModified: new Date()
    };

    await saveBox(settings, box, false);

    dispatch({
        type: InventoryActionTypes.CreateBox,
        boxInfo: {
            name,
            lastModified: box.lastModified
        }
    });

    return {
        name,
        lastModified: box.lastModified
    };
}

export async function deleteBox(settings: AppSettings, name: string, dispatch: (action: InventoryAction) => void) : Promise<void> {
    const path = getBoxPath(settings, name);
    const exists = fs.existsSync(path);

    if (exists) {
        await fs.promises.rm(path);
    }

    dispatch({
        type: InventoryActionTypes.DeleteBox,
        boxInfo: {
            name,
            lastModified: new Date()
        }
    });
}

async function openBox(settings: AppSettings, name: string) : Promise<Box> {
    const path = getBoxPath(settings, name);
    const exists = fs.existsSync(path);

    if (!exists) {
        throw Error(`Box not found: ${name}`);
    }

    const buffer = await fs.promises.readFile(path);
    const json = buffer.toString();
    const box: Box = JSON.parse(json);
    return box;
}

async function saveBox(settings: AppSettings, box: Box, overwrite: boolean) : Promise<void> {
    const path = getBoxPath(settings, box.name);
    const exists = fs.existsSync(path);
    if (exists) {
        if (overwrite) {
            await fs.promises.rm(path);
        } else {
            throw Error(`Box already exists: ${box.name}`);
        }
    }

    const json = JSON.stringify(box);

    await fs.promises.writeFile(path, json);
}

export async function loadBox(settings: AppSettings, name: string, dispatch: (action:InventoryAction) => void) : Promise<Box> {
    dispatch({
        type: InventoryActionTypes.LoadBoxStart,
        name
    });

    const box = await openBox(settings, name);

    dispatch({
        type: InventoryActionTypes.LoadBoxSuccess,
        box
    });

    return box;
}

export async function updateBox(settings: AppSettings, box: Box, dispatch: (action: InventoryAction) => void) : Promise<BoxInfo> {
    dispatch({
        type: InventoryActionTypes.SaveBoxStart,
        box
    });

    const lastModified = new Date();

    const updatedBox = {
        ...box,
        lastModified
    };

    await saveBox(settings, updatedBox, true);

    dispatch({
        type: InventoryActionTypes.SaveBoxSuccess,
        box
    });

    return {
        name: box.name,
        lastModified
    };
}

export async function renameBox(settings: AppSettings, oldName: string, newName: string, dispatch: (action: InventoryAction) => void) : Promise<BoxInfo> {
    const oldPath = getBoxPath(settings, oldName);
    const newPath = getBoxPath(settings, newName);

    if (fs.existsSync(newPath)) {
        throw `Box named ${newName} already exists.`;
    }

    let box = await openBox(settings, oldName);

    box = { ...box, name: newName };

    await saveBox(settings, box, true);

    await fs.promises.rm(oldPath);

    dispatch({
        type: InventoryActionTypes.RenameBox,
        oldName,
        newName
    });

    return box;
}

export async function mergeBoxes(settings: AppSettings, fromBoxName: string, toBoxName: string, dispatch: (action: InventoryAction) => void) : Promise<BoxInfo> {
    const fromBox = await openBox(settings, fromBoxName);
    const toBox = await openBox(settings, toBoxName);

    let cards = fromBox.cards.concat(toBox.cards);
    let groups = groupBy(cards, BoxCardModule.getKey);
    cards = Object.entries(groups).map(entry => {
        const [_, items] = entry;
        return {
            ...items[0],
            count: items.map(c => c.count).reduce((a, b) => a + b, 0)
        }
    });
    cards = orderBy(cards, c => normalizeName(c.name));

    const merged = {
        ...toBox,
        cards
    };

    await saveBox(settings, merged, true);
    await fs.promises.rm(getBoxPath(settings, fromBoxName));

    dispatch({
        type: InventoryActionTypes.MergeBoxes,
        removedBoxName: fromBoxName,
        updatedBox: merged
    });

    return merged;
}