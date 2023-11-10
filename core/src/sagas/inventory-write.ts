import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  BoxCreateAction,
  BoxDeleteAction,
  BoxRenameAction,
  BoxSaveAction,
  BoxTransferBulkAction,
  BoxTransferSingleAction,
  inventoryActions,
  InventoryActionTypes,
} from "../store/inventory";
import { selectors } from "../store";
import { InventoryWriteProvider } from "../domain/interfaces";
import { AsyncRequestStatus } from "../domain/async-request";
import { AppSettings } from "../domain/config";
import { CardIndex } from "../domain/encyclopedia";
import { Box, BoxState, combineDuplicates, getKey, removeZeroes } from "../domain/inventory";

export const getInventoryWriteSaga = (provider: InventoryWriteProvider) => {
  function* saveBox(action: BoxSaveAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const box = {
        ...action.value.data,
        lastModified: new Date(),
      };
      yield call(() => provider.saveBox(settings, box, true));
      yield put(inventoryActions.boxSaveSuccess(box));
    } catch (error) {
      yield put(inventoryActions.boxSaveFailure(`${error}`));
    }
  }

  function* renameBox(action: BoxRenameAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const cardIndex: CardIndex = yield select(selectors.cardIndex);
      const [oldName, newName] = action.value.data;
      yield call(() =>
        provider.renameBox(settings, oldName, newName, cardIndex)
      );
      yield put(inventoryActions.boxRenameSuccess(oldName, newName));
    } catch (error) {
      yield put(inventoryActions.boxRenameFailure(`${error}`));
    }
  }

  function* createBox(action: BoxCreateAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const box: Box = {
        name: action.value.data,
        description: "",
        cards: [],
        lastModified: new Date(),
      };

      yield call(() => provider.saveBox(settings, box, false));
      yield put(inventoryActions.boxCreateSuccess(box));
    } catch (error) {
      yield put(inventoryActions.boxCreateFailure(`${error}`));
    }
  }

  function* deleteBox(action: BoxDeleteAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const name = action.value.data;
      yield call(() => provider.deleteBox(settings, name));
      yield put(inventoryActions.boxDeleteSuccess(name));
    } catch (error) {
      yield put(inventoryActions.boxDeleteFailure(`${error}`));
    }
  }

  function* transferBulk(action: BoxTransferBulkAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const boxes: BoxState[] = yield select(selectors.boxes);
      const request = action.value.data;
      const fromBox = boxes.find((b) => b.name === request.fromBoxName);
      const toBox = boxes.find((b) => b.name === request.toBoxName);
      if (!fromBox || !toBox) {
        throw "Box not found.";
      }

      const cardsToTransfer =
        fromBox.cards?.filter((c) =>
          request.cardKeys.includes(getKey(c))
        ) ?? [];
      const fromBoxCards =
        fromBox.cards?.filter(
          (c) => !request.cardKeys.includes(getKey(c))
        ) ?? [];
      const toBoxCards = combineDuplicates(
        cardsToTransfer.concat(toBox.cards ?? [])
      );

      const updatedFromBox: Box = {
        name: fromBox.name,
        description: fromBox.description ?? "",
        cards: fromBoxCards,
        lastModified: new Date(),
      };

      const updatedToBox = {
        name: toBox.name,
        description: toBox.description ?? "",
        cards: toBoxCards,
        lastModified: new Date(),
      };

      yield call(() => provider.saveBox(settings, updatedFromBox, true));
      yield call(() => provider.saveBox(settings, updatedToBox, true));

      const updatedBoxes: Box[] = [updatedFromBox, updatedToBox];

      yield put(inventoryActions.boxTransferBulkSuccess(updatedBoxes));
    } catch (error) {
      yield put(inventoryActions.boxTransferBulkFailure(`${error}`));
    }
  }

  function* transferSingle(action: BoxTransferSingleAction) {
    if (action.value.status !== AsyncRequestStatus.Started) {
      return;
    }

    try {
      const settings: AppSettings = yield select(selectors.settings);
      const boxes: BoxState[] = yield select(selectors.boxes);
      const request = action.value.data;
      const fromBox = boxes.find((b) => b.name === request.fromBoxName);
      const toBox = boxes.find((b) => b.name === request.toBoxName);
      if (!fromBox || !toBox) {
        throw "Box not found.";
      }

      const keyToTransfer = getKey(request.card);
      const fromBoxCards = removeZeroes(
        fromBox.cards?.map((c) => {
          if (getKey(c) === keyToTransfer) {
            return { ...c, count: c.count - request.card.count };
          } else {
            return c;
          }
        }) ?? []
      );
      const toBoxCards = combineDuplicates(
        [request.card].concat(toBox.cards ?? [])
      );

      const updatedFromBox: Box = {
        name: fromBox.name,
        description: fromBox.description ?? "",
        cards: fromBoxCards,
        lastModified: new Date(),
      };

      const updatedToBox = {
        name: toBox.name,
        description: toBox.description ?? "",
        cards: toBoxCards,
        lastModified: new Date(),
      };

      yield call(() => provider.saveBox(settings, updatedFromBox, true));
      yield call(() => provider.saveBox(settings, updatedToBox, true));

      const updatedBoxes: Box[] = [updatedFromBox, updatedToBox];

      yield put(inventoryActions.boxTransferBulkSuccess(updatedBoxes));
    } catch (error) {
      yield put(inventoryActions.boxTransferBulkFailure(`${error}`));
    }
  }

  return function* saga() {
    yield takeEvery(InventoryActionTypes.BoxSave, saveBox);
    yield takeEvery(InventoryActionTypes.BoxRename, renameBox);
    yield takeEvery(InventoryActionTypes.BoxCreate, createBox);
    yield takeEvery(InventoryActionTypes.BoxDelete, deleteBox);
    yield takeEvery(InventoryActionTypes.BoxTransferBulk, transferBulk);
    yield takeEvery(InventoryActionTypes.BoxTransferSingle, transferSingle);
  };
};
