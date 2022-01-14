import * as fs from 'fs';
import { dirname } from 'path';

export function createDirIfMissing(dir: string) {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

export function createFileAndDirectoryIfRequired(path: string, content: string) {
    const dir = dirname(path);
    createDirIfMissing(dir);
    fs.writeFileSync(path, content);
}