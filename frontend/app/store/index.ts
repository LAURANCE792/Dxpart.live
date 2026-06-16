import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import botReducer from './slices/botSlice';
import tradeReducer from './slices/tradeSlice';
import marketReducer from './slices/marketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bot: botReducer,
    trade: tradeReducer,
    market: marketReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
