import { combineReducers, createStore, StoreEnhancer } from '@reduxjs/toolkit';
import { EncyclopediaAction, EncyclopediaActionTypes, encyclopediaReducer } from './encyclopedia';
import { InventoryAction, inventoryReducer } from './inventory';
import { SettingsAction, settingsReducer } from './settings';

type Action =
  EncyclopediaAction |
  InventoryAction |
  SettingsAction

const reducer = combineReducers({
    encyclopedia: encyclopediaReducer,
    inventory: inventoryReducer,
    settings: settingsReducer
});

// Large payloads break the devtools
// https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#excessive-use-of-memory-and-cpu
const actionSanitizer =  (action: Action) => {
  switch (action.type) {
    case EncyclopediaActionTypes.LoadSuccess:
      return { ...action, cards: '<<LARGE BLOB>>' };
    default:
      return action;
  }
};

const stateSanitizer = (state: any /* RootState is defined below */) => {
  return {
    ...state,
    encyclopedia: '<<LARGE BLOB>>'
  }
}

const enhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__
  && (window as any).__REDUX_DEVTOOLS_EXTENSION__({
    actionSanitizer,
    stateSanitizer
  });

export const store = createStore(
    reducer,
    enhancer
);

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch