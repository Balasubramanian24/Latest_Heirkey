import { configureStore } from '@reduxjs/toolkit';
import homeInstructionsReducer from './slices/homeInstructionsSlice';
import funeralArrangementsReducer from './slices/funeralArrangementsSlice';
import willInstructionsReducer from './slices/willInstructionsSlice';

export const store = configureStore({
  reducer: {
    homeInstructions: homeInstructionsReducer,
    funeralArrangements: funeralArrangementsReducer,
    willInstructions: willInstructionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
