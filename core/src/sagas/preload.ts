import { put, select, takeEvery, takeLeading } from "redux-saga/effects";
import {
  encyclopediaActions,
  EncyclopediaActionTypes,
  LoadCardDataAction,
  LoadFormatDataAction,
  LoadSetDataAction,
} from "../store/encyclopedia";
import {
  BoxInfosLoadAction,
  BoxLoadAction,
  inventoryActions,
  InventoryActionTypes,
} from "../store/inventory";
import {
  preloadActions,
  PreloadActionTypes,
  PreloadStartAction,
} from "../store/preload";
import { selectors } from "../store";
import {
  settingsActions,
  SettingsActionTypes,
  SettingsLoadAction,
} from "../store/settings";
import { AsyncRequestStatus } from "../domain/async-request";
import { BoxState } from "../domain/inventory";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* onPreloadStart(_: PreloadStartAction) {
  console.log("onPreloadStart");
  yield put(settingsActions.loadStart());
}

function* onSettingsLoad(action: SettingsLoadAction) {
  switch (action.value.status) {
    case AsyncRequestStatus.Started:
      console.log("onSettingsLoad Started");
      yield put(preloadActions.update("Loading settings..."));
      break;
    case AsyncRequestStatus.Success:
      console.log("onSettingsLoad Success");
      yield put(encyclopediaActions.loadCardDataStart());
      break;
  }
}

function* onEncyclopediaLoadCardData(action: LoadCardDataAction) {
  switch (action.value.status) {
    case AsyncRequestStatus.Started:
      console.log("onEncyclopediaLoadCardData Started");
      yield put(preloadActions.update("Loading Scryfall card data..."));
      break;
    case AsyncRequestStatus.Success:
      console.log("onEncyclopediaLoadCardData Success");
      yield put(encyclopediaActions.loadSetDataStart());
      break;
  }
}

function* onEncyclopediaLoadSetData(action: LoadSetDataAction) {
  switch (action.value.status) {
    case AsyncRequestStatus.Started:
      console.log("onEncyclopediaLoadSetData Started");
      yield put(preloadActions.update("Loading Scryfall set data..."));
      break;
    case AsyncRequestStatus.Success: {
      const sets = action.value.data;
      console.log("onEncyclopediaLoadSetData Success");
      for (const s of sets) {
        yield put(encyclopediaActions.loadSetSymbolStart(s.code));
      }

      yield put(encyclopediaActions.loadFormatDataStart());
      break;
    }
  }
}

function* onEncyclopediaLoadFormatData(action: LoadFormatDataAction) {
  switch (action.value.status) {
    case AsyncRequestStatus.Started:
      console.log("onEncyclopediaLoadFormatData Started");
      yield put(preloadActions.update("Loading Scryfall format data..."));
      break;
    case AsyncRequestStatus.Success: {
      const sets = action.value.data;
      console.log("onEncyclopediaLoadFormatData Success");

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
      const boxes: BoxState[] = yield select(selectors.boxes);
      const otherBoxes = boxes.filter((b) => b.name !== box.name);
      const isLastBox = otherBoxes.every((b) => b.cards !== null);
      if (isLastBox) {
        yield put(preloadActions.finish());
      }
      break;
    }
  }
}

export const preloadSaga = function* () {
  yield takeLeading(PreloadActionTypes.Start, onPreloadStart);
  yield takeEvery(SettingsActionTypes.Load, onSettingsLoad);
  yield takeLeading(
    EncyclopediaActionTypes.LoadCardData,
    onEncyclopediaLoadCardData
  );
  yield takeLeading(
    EncyclopediaActionTypes.LoadSetData,
    onEncyclopediaLoadSetData
  );
  yield takeLeading(
    EncyclopediaActionTypes.LoadFormatData,
    onEncyclopediaLoadFormatData
  );
  yield takeEvery(InventoryActionTypes.BoxInfosLoad, onBoxInfosLoad);
  yield takeEvery(InventoryActionTypes.BoxLoad, onBoxLoad);
};
