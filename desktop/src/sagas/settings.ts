import * as fs from 'fs';
import { put, takeEvery, takeLeading } from 'redux-saga/effects';
import { createFileAndDirectoryIfRequired } from '../logic/file-helpers';
import { AsyncRequestStatus } from "leng-core/src/logic/model";
import { settingsActions, SettingsActionTypes, SettingsLoadAction, SettingsSaveAction } from 'leng-core/src/store/settings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dir = `${(process.env as any).USERPROFILE.replace('\\', '/')}/leng`;
const settingsPath = `${dir}/settings.json`;

const defaultSettings = {
    dataPath: dir
};

function loadSettingsOrDefaults() {
    try {
        const json = fs.readFileSync(settingsPath).toString();
        return JSON.parse(json);
    }
    catch {
        const json = JSON.stringify(defaultSettings);
        createFileAndDirectoryIfRequired(settingsPath, json);
        return defaultSettings;
    }
}

function* saveSettings(action: SettingsSaveAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const json = JSON.stringify(action.value.data);
        createFileAndDirectoryIfRequired(settingsPath, json);
        yield put(settingsActions.saveSuccess(action.value.data));
    }
    catch (error) {
        yield put(settingsActions.saveError(`${error}`));
    }
}

function* loadSettings(action: SettingsLoadAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings = loadSettingsOrDefaults();
        yield put(settingsActions.loadSuccess(settings));

    }
    catch (error) {
        yield put(settingsActions.loadError(`${error}`));
    }
}

function* settingsSaga() {
    yield takeLeading(SettingsActionTypes.Load, loadSettings);
    yield takeEvery(SettingsActionTypes.Save, saveSettings);
}
export default settingsSaga;