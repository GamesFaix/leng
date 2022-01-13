import * as fs from 'fs';
import { dirname } from 'path';

export function createFileAndDirectoryIfRequired(path: string, content: string) {
    const dir = dirname(path);
    if (!fs.existsSync(dir)){
        console.log("creating dir " + dir);
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(path, content);
}