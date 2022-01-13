import * as fs from 'fs';
import { dirname } from 'path';
import { SettingsAction, SettingsActionTypes } from '../store/settings';

export type AppSettings = {
    dataPath: string
};

const dir = `${process.env.USERPROFILE.replace('\\', '/')}/leng`;
const settingsPath = `${dir}/settings.json`;

export const defaultSettings = {
    dataPath: dir
};

function loadSettingsOrDefaults() {
    try {
        const json = fs.readFileSync(settingsPath).toString();
        return JSON.parse(json);
    }
    catch {
        return defaultSettings;
    }
}

export function loadSettings(dispatch: (action: SettingsAction) => void) : AppSettings {
    dispatch({ type: SettingsActionTypes.LoadStart });
    const settings = loadSettingsOrDefaults();
    dispatch({ type: SettingsActionTypes.LoadSuccess, settings });
    return settings;
}

function createFileAndDirectoryIfRequired(path: string, content: string) {
    const dir = dirname(path);
    if (!fs.existsSync(dir)){
        console.log("creating dir " + dir);
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(path, content);
}

export function saveSettings(settings: AppSettings, dispatch: (action: SettingsAction) => void) : void {
    console.log("saveSettings");
    const json = JSON.stringify(settings);
    createFileAndDirectoryIfRequired(settingsPath, json);
    dispatch({ type: SettingsActionTypes.Updated, settings });
}