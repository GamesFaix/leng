import * as fs from 'fs';
import { put, takeEvery } from 'redux-saga/effects';
import { createFileAndDirectoryIfRequired } from '../logic/file-controller';
import { AsyncRequestStatus } from '../logic/model';
import { SettingsActionTypes, SettingsLoadAction, SettingsSaveAction } from '../store/settings';

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
        yield put({
            type: SettingsActionTypes.Save,
            value: {
                status: AsyncRequestStatus.Success,
                data: action.value.data
            }
        });
    }
    catch (error) {
        yield put({
            type: SettingsActionTypes.Save,
            value: {
                status: AsyncRequestStatus.Failure,
                error
            }
        });
    }
}

function* loadSettings(action: SettingsLoadAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
        return;
    }

    try {
        const settings = loadSettingsOrDefaults();
        yield put({
            type: SettingsActionTypes.Load,
            value: {
                status: AsyncRequestStatus.Success,
                data: settings
            }
        });

    }
    catch (error) {
        yield put({
            type: SettingsActionTypes.Load,
            value: {
                status: AsyncRequestStatus.Failure,
                error
            }
        });
    }
}

function* settingsSaga() {
    yield takeEvery(SettingsActionTypes.Load, loadSettings);
    yield takeEvery(SettingsActionTypes.Save, saveSettings);
}
export default settingsSaga;