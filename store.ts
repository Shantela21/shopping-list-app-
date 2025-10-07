import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './src/features/LoginSlice';
import registerReducer from './src/features/RegisterSlice';
import shoppingReducer from './src/features/ShoppingSlice';
import landingReducer from './src/features/LandingPageSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    // Add other reducers here
    shopping: shoppingReducer,
    landing: landingReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;