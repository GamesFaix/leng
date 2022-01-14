import { AppSettings } from "./settings-controller";
import * as fs from 'fs';
import { createDirIfMissing } from "./file-controller";
import { parse } from 'path';

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

export async function getBoxInfos(settings: AppSettings) : Promise<BoxInfo[]> {
    const dir = `${settings.dataPath}/inventory`;
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