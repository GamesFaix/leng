import { AppSettings } from "./settings-controller";
import * as fs from 'fs';
import { createDirIfMissing } from "./file-controller";
import { parse } from 'path';
import { InventoryAction, InventoryActionTypes } from "../store/inventory";

export type BoxCard = {
    scryfallId: string,
    count: number,
    foil: boolean,
    name: string, // for user readability
    version: string, // for user readability
}

export type Box = {
    name: string,
    lastModified: Date,
    description: string,
    cards: BoxCard[]
}

export type BoxInfo = {
    name: string
    lastModified: Date
}

function getInventoryDir(settings: AppSettings) : string {
    return `${settings.dataPath}/inventory`;
}

export async function getBoxInfos(settings: AppSettings) : Promise<BoxInfo[]> {
    const dir = getInventoryDir(settings);
    createDirIfMissing(dir);
    const files = await fs.promises.readdir(dir);

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
    const dir = getInventoryDir(settings);
    const path = `${dir}/${name}.json`;
    const exists = fs.existsSync(path);
    if (exists) {
        throw Error(`Box already exists: ${name}`);
    }

    const box: Box = {
        name,
        description: '',
        cards: [],
        lastModified: new Date()
    };

    const json = JSON.stringify(box);

    await fs.promises.writeFile(path, json);

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
    const dir = getInventoryDir(settings);
    const path = `${dir}/${name}.json`;
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

export async function loadBox(settings: AppSettings, name: string) : Promise<Box> {
    const dir = getInventoryDir(settings);
    const path = `${dir}/${name}.json`;
    const exists = fs.existsSync(path);

    if (!exists) {
        throw Error(`Box not found: ${name}`);
    }

    const buffer = await fs.promises.readFile(path);

    const box: Box = JSON.parse(buffer.toString());

    // Add to store

    return box;
}

export async function updateBox(settings: AppSettings, box: Box) : Promise<BoxInfo> {
    const dir = getInventoryDir(settings);
    const path = `${dir}/${box.name}.json`;
    const exists = fs.existsSync(path);
    if (exists) {
        await fs.promises.rm(path);
    }

    const lastModified = new Date();

    const json = JSON.stringify({ ...box, lastModified });

    await fs.promises.writeFile(path, json);

    // Update store

    return {
        name: box.name,
        lastModified
    };
}