import { put, select, takeEvery, takeLeading } from "redux-saga/effects";
import { AsyncRequestStatus } from "leng-core/src/logic/model";
import { encyclopediaActions, EncyclopediaActionTypes, LoadCardDataAction, LoadSetDataAction } from "../store/encyclopedia";
import { BoxInfosLoadAction, BoxLoadAction, BoxState, inventoryActions, InventoryActionTypes } from "../store/inventory";
import { preloadActions, PreloadActionTypes, PreloadStartAction } from "../store/preload";
import selectors from "../store/selectors";
import { settingsActions, SettingsActionTypes, SettingsLoadAction } from "../store/settings";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* onPreloadStart(_: PreloadStartAction) {
    yield put(settingsActions.loadStart());
}

function* onSettingsLoad(action: SettingsLoadAction) {
    switch (action.value.status) {
        case AsyncRequestStatus.Started:
            yield put(preloadActions.update("Loading settings..."));
            break;
        case AsyncRequestStatus.Success:
            yield put(encyclopediaActions.loadCardDataStart());
            break;
    }
}

function* onEncyclopediaLoadCardData(action: LoadCardDataAction) {
    switch (action.value.status) {
        case AsyncRequestStatus.Started:
            yield put(preloadActions.update("Loading Scryfall card data..."));
            break;
        case AsyncRequestStatus.Success:
            yield put(encyclopediaActions.loadSetDataStart());
            break;
    }
}

function* onEncyclopediaLoadSetData(action: LoadSetDataAction) {
    switch (action.value.status) {
        case AsyncRequestStatus.Started:
            yield put(preloadActions.update("Loading Scryfall set data..."));
            break;
        case AsyncRequestStatus.Success: {
            const sets = action.value.data;
            for (const s of sets) {
                yield put(encyclopediaActions.loadSetSymbolStart(s.code));
            }

            yield put(inventoryActions.boxInfosLoadStart());
            break;
        }
    }
}

function* onBoxInfosLoad(action: BoxInfosLoadAction) {
    switch (action.value.status) {
        case AsyncRequestStatus.Started:
            yield put(preloadActions.update("Loading box metadata..."));
            break;
        case AsyncRequestStatus.Success: {
            const boxInfos = action.value.data ?? [];
            if (boxInfos.length === 0) {
                yield put(preloadActions.finish());
            } else {
                for (const b of boxInfos) {
                    yield put(inventoryActions.boxLoadStart(b.name));
                }
            }
            break;
        }
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
    yield takeLeading(EncyclopediaActionTypes.LoadCardData, onEncyclopediaLoadCardData);
    yield takeLeading(EncyclopediaActionTypes.LoadSetData, onEncyclopediaLoadSetData);
    yield takeEvery(InventoryActionTypes.BoxInfosLoad, onBoxInfosLoad);
    yield takeEvery(InventoryActionTypes.BoxLoad, onBoxLoad);
}
export default preloadSaga;