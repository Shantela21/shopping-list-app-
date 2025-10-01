import { configureStore } from '@reduxjs/toolkit';
import LoginSlice from './src/features/LoginSlice';
import Register from './src/pages/Register';

export const store = configureStore({
  reducer: {
    login: LoginSlice,
    register: Register,
    // Add other reducers here
  },
});




export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;