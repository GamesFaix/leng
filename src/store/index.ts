import { configureStore } from '@reduxjs/toolkit';
import { currentSelectionReducer } from './currentSelection';
import { encyclopediaReducer } from './encyclopedia';
import { inventoryReducer } from './inventory';

export const store = configureStore({
    reducer: {
        encyclopedia: encyclopediaReducer,
        inventory: inventoryReducer,
        currentSelection: currentSelectionReducer
    }
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch