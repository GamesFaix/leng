import { applyMiddleware, combineReducers, compose, createStore } from '@reduxjs/toolkit';
import { EncyclopediaAction, EncyclopediaActionTypes, encyclopediaReducer } from './encyclopedia';
import { InventoryAction, inventoryReducer } from './inventory';
import { SettingsAction, settingsReducer } from './settings';
import createSagaMiddleware from 'redux-saga'
import settingsSaga from '../sagas/settings';
import { AsyncRequestStatus } from '../logic/model';
import encyclopediaSaga from '../sagas/encyclopedia';
import inventorySaga from '../sagas/inventory';

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
  if (action.type === EncyclopediaActionTypes.Load
    && action.value.status === AsyncRequestStatus.Success) {
      return {
        ...action,
        value: {
          ...action.value,
          data: '<<LARGE BLOB>>'
        }
      }
  } else {
    return action;
  }
};

const stateSanitizer = (state: any /* RootState is defined below */) => {
  return {
    ...state,
    encyclopedia: '<<LARGE BLOB>>'
  }
}

const devToolsEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__
  && (window as any).__REDUX_DEVTOOLS_EXTENSION__({
    actionSanitizer,
    stateSanitizer
  });

const sagaMiddleware = createSagaMiddleware();

const middlewareEnhancer = applyMiddleware(sagaMiddleware);

const enhancers = compose(middlewareEnhancer, devToolsEnhancer);

export const store = createStore(
    reducer,
    enhancers
);

sagaMiddleware.run(settingsSaga);
sagaMiddleware.run(encyclopediaSaga);
sagaMiddleware.run(inventorySaga);

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch