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
} from "./encyclopedia";
import { InventoryAction, inventoryReducer } from "./inventory";
import { SettingsAction, settingsReducer } from "./settings";
import { PreloadAction, preloadReducer } from "./preload";
import { EditingAction, editingReducer } from "./editing";
import { SearchAction, searchReducer } from "./search";
import createSagaMiddleware from "redux-saga";
import { AsyncRequestStatus } from "../domain/async-request";

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
    action.type === EncyclopediaActionTypes.LoadCardData &&
    action.value.status === AsyncRequestStatus.Success
  ) {
    return {
      ...action,
      value: {
        ...action.value,
        data: `<<Omitting large blob. ${action.value.data.length} cards loaded.>>`,
      },
    };
  } else if (
    action.type === EncyclopediaActionTypes.LoadSetData &&
    action.value.status === AsyncRequestStatus.Success
  ) {
    return {
      ...action,
      value: {
        ...action.value,
        data: `<<Omitting large blob. ${action.value.data.length} sets loaded.>>`,
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
    encyclopedia: `<<Omitting large blob. Encyclopedia contains ${state.encyclopedia.cards.length} cards and ${state.encyclopedia.sets.length} sets.>>`,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

const getReduxDevToolsEnhancer = () =>
  reduxDevTools({
    actionSanitizer,
    stateSanitizer,
  });

export const sagaMiddleware = createSagaMiddleware();

const middlewareEnhancer = applyMiddleware(sagaMiddleware);

const enhancers = reduxDevTools
  ? compose(middlewareEnhancer, getReduxDevToolsEnhancer())
  : middlewareEnhancer;

export const store = createStore(reducer, enhancers);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export { selectors } from "./selectors";
