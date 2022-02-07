import { put, select, takeEvery, takeLeading } from "redux-saga/effects";
import { AsyncRequestStatus } from "../logic/model";
import { encyclopediaActions, EncyclopediaActionTypes, EncyclopediaLoadAction } from "../store/encyclopedia";
import { BoxInfosLoadAction, BoxLoadAction, BoxState, inventoryActions, InventoryActionTypes } from "../store/inventory";
import { preloadActions, PreloadActionTypes, PreloadStartAction } from "../store/preload";
import selectors from "../store/selectors";
import { settingsActions, SettingsActionTypes, SettingsLoadAction } from "../store/settings";

function* onPreloadStart(action: PreloadStartAction) {
    yield put(settingsActions.loadStart());
}

function* onSettingsLoad(action: SettingsLoadAction) {
    switch (action.value.status) {
        case AsyncRequestStatus.Started:
            yield put(preloadActions.update("Loading settings..."));
            break;
        case AsyncRequestStatus.Success:
            yield put(encyclopediaActions.loadStart());
            break;
    }
}

function* onEncyclopediaLoad(action: EncyclopediaLoadAction) {
    switch (action.value.status) {
        case AsyncRequestStatus.Started:
            yield put(preloadActions.update("Loading Scryfall data..."));
            break;
        case AsyncRequestStatus.Success:
            yield put(inventoryActions.boxInfosLoadStart());
            break;
    }
}

function* onBoxInfosLoad(action: BoxInfosLoadAction) {
    switch (action.value.status) {
        case AsyncRequestStatus.Started:
            yield put(preloadActions.update("Loading box metadata..."));
            break;
        case AsyncRequestStatus.Success:
            const boxInfos = action.value.data ?? [];
            for (let b of boxInfos) {
                yield put(inventoryActions.boxLoadStart(b.name));
            }
            break;
    }
}

function* onBoxLoad(action: BoxLoadAction) {
    switch (action.value.status) {
        case AsyncRequestStatus.Started: {
            const boxName = action.value.data;
            yield put(preloadActions.update(`Loading box ${boxName}...`));
            break;
        }
        case AsyncRequestStatus.Success: {
            const box = action.value.data;
            const boxes : BoxState[] = yield select(selectors.boxes);
            const otherBoxes = boxes.filter(b => b.name !== box.name);
            const isLastBox = otherBoxes.every(b => b.cards !== null);
            if (isLastBox) {
                yield put(preloadActions.finish());
            }
            break;
        }
    }
}

function* preloadSaga() {
    yield takeLeading(PreloadActionTypes.Start, onPreloadStart);
    yield takeEvery(SettingsActionTypes.Load, onSettingsLoad);
    yield takeEvery(EncyclopediaActionTypes.Load, onEncyclopediaLoad);
    yield takeEvery(InventoryActionTypes.BoxInfosLoad, onBoxInfosLoad);
    yield takeEvery(InventoryActionTypes.BoxLoad, onBoxLoad);
}
export default preloadSaga;