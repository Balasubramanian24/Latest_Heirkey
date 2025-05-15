import { configureStore } from '@reduxjs/toolkit';
import homeInstructionsReducer from './slices/homeInstructionsSlice';
import funeralArrangementsReducer from './slices/funeralArrangementsSlice';

export const store = configureStore({
  reducer: {
    homeInstructions: homeInstructionsReducer,
    funeralArrangements: funeralArrangementsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;