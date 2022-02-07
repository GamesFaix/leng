
// function* loadSettings(action: SettingsLoadAction) {
//     if (action.value.status !== AsyncRequestStatus.Started) {
//         return;
//     }

//     try {
//         const settings = loadSettingsOrDefaults();
//         yield put(settingsActions.loadSuccess(settings));

//     }
//     catch (error) {
//         yield put(settingsActions.loadError(`${error}`));
//     }
// }

function* preloadSaga() {
    // yield takeLeading(SettingsActionTypes.Load, loadSettings);
    // yield takeEvery(SettingsActionTypes.Save, saveSettings);
}
export default preloadSaga;