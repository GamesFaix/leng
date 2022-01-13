import * as fs from 'fs';
import { SettingsAction, SettingsActionTypes } from '../store/settings';

export type AppSettings = {
    dataPath: string
};

const settingsPath = "/settings.json";

export const defaultSettings = {
    dataPath: ''
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
    const json = JSON.stringify(settings);
    fs.writeFileSync(settingsPath, json);
    dispatch({ type: SettingsActionTypes.Updated, settings });
}