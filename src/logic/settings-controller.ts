import * as fs from 'fs';
import { SettingsAction, SettingsActionTypes } from '../store/settings';
import { createFileAndDirectoryIfRequired } from './file-controller';

export type AppSettings = {
    dataPath: string
};

const dir = `${(process.env as any).USERPROFILE.replace('\\', '/')}/leng`;
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

export function saveSettings(settings: AppSettings, dispatch: (action: SettingsAction) => void) : void {
    console.log("saveSettings");
    const json = JSON.stringify(settings);
    createFileAndDirectoryIfRequired(settingsPath, json);
    dispatch({ type: SettingsActionTypes.Updated, settings });
}