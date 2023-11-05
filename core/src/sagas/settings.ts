import { put, takeEvery, takeLeading } from "redux-saga/effects";
import { AsyncRequestStatus } from "../logic/model";
import {
  settingsActions,
  SettingsActionTypes,
  SettingsLoadAction,
  SettingsSaveAction,
} from "../store/settings";
import { SettingsProvider } from "../logic/interfaces";

export const getSettingsSaga = (provider: SettingsProvider) => {
  function* loadSettings(action: SettingsLoadAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings = provider.load();
      yield put(settingsActions.loadSuccess(settings));
    } catch (error) {
      yield put(settingsActions.loadError(`${error}`));
    }
  }

  function* saveSettings(action: SettingsSaveAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      provider.save(action.value.data);
      yield put(settingsActions.saveSuccess(action.value.data));
    } catch (error) {
      yield put(settingsActions.saveError(`${error}`));
    }
  }

  return function* saga() {
    yield takeLeading(SettingsActionTypes.Load, loadSettings);
    yield takeEvery(SettingsActionTypes.Save, saveSettings);
  };
};
