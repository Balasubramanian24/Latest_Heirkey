import { configureStore } from '@reduxjs/toolkit';
import homeInstructionsReducer from './slices/homeInstructionsSlice';

export const store = configureStore({
  reducer: {
    homeInstructions: homeInstructionsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
