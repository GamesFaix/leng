import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from "@reduxjs/toolkit";
import {
  EncyclopediaAction,
  EncyclopediaActionTypes,
  encyclopediaReducer,
} from "leng-core/src/store/encyclopedia";
import { InventoryAction, inventoryReducer } from "./inventory";
import { SettingsAction, settingsReducer } from "./settings";
import createSagaMiddleware from "redux-saga";
import settingsSaga from "../sagas/settings";
import { AsyncRequestStatus } from "leng-core/src/logic/model";
import encyclopediaSaga from "../sagas/encyclopedia";
import inventorySaga from "../sagas/inventory";
import { PreloadAction, preloadReducer } from "./preload";
import preloadSaga from "../sagas/preload";
import { EditingAction, editingReducer } from "./editing";
import { SearchAction, searchReducer } from "./search";
import searchSaga from "../sagas/search";

type Action =
  | EncyclopediaAction
  | InventoryAction
  | SettingsAction
  | PreloadAction
  | EditingAction
  | SearchAction;

const reducer = combineReducers({
  encyclopedia: encyclopediaReducer,
  inventory: inventoryReducer,
  settings: settingsReducer,
  preload: preloadReducer,
  editing: editingReducer,
  search: searchReducer,
});

// Large payloads break the devtools
// https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#excessive-use-of-memory-and-cpu
const actionSanitizer = (action: Action) => {
  if (
    (action.type === EncyclopediaActionTypes.LoadCardData ||
      action.type === EncyclopediaActionTypes.LoadSetData) &&
    action.value.status === AsyncRequestStatus.Success
  ) {
    return {
      ...action,
      value: {
        ...action.value,
        data: "<<LARGE BLOB>>",
      },
    };
  } else {
    return action;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stateSanitizer = (state: any /* RootState is defined below */) => {
  return {
    ...state,
    encyclopedia: "<<LARGE BLOB>>",
  };
};

const devToolsEnhancer =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__REDUX_DEVTOOLS_EXTENSION__({
    actionSanitizer,
    stateSanitizer,
  });

const sagaMiddleware = createSagaMiddleware();

const middlewareEnhancer = applyMiddleware(sagaMiddleware);

const enhancers = compose(middlewareEnhancer, devToolsEnhancer);

export const store = createStore(reducer, enhancers);

const sagas = [
  settingsSaga,
  encyclopediaSaga,
  inventorySaga,
  preloadSaga,
  searchSaga,
];
sagas.forEach(sagaMiddleware.run);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
