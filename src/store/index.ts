import { applyMiddleware, combineReducers, createStore } from '@reduxjs/toolkit';
import { encyclopediaReducer } from './encyclopedia';
import { inventoryReducer } from './inventory';
import logger from 'redux-logger';
import { settingsReducer } from './settings';

const reducer = combineReducers({
    encyclopedia: encyclopediaReducer,
    inventory: inventoryReducer,
    settings: settingsReducer
});

export const store = createStore(
    reducer,
  //  applyMiddleware(logger)
);

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch