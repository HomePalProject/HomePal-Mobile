import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer, { forceLogout } from '@/src/store/slices/authSlice';
import { registerOnUnauthorizedCallback } from '@/src/services/api/client';
import { baseApi } from '@/src/services/api/baseApi';

import uiReducer from '@/src/store/slices/uiSlice';
import profileReducer from '@/src/store/slices/profileSlice';
import pantryReducer from '@/src/store/slices/pantrySlice';
import shoppingListReducer from '@/src/store/slices/shoppingListSlice';
import budgetReducer from '@/src/store/slices/budgetSlice';
import mealPlansReducer from '@/src/store/slices/mealPlansSlice';
import agentChatReducer from '@/src/store/slices/agentChatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    profile: profileReducer,
    pantry: pantryReducer,
    shoppingList: shoppingListReducer,
    budget: budgetReducer,
    mealPlans: mealPlansReducer,
    agentChat: agentChatReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

// Register callback so Axios interceptor can dispatch logout on 401 token refresh failure
registerOnUnauthorizedCallback(() => {
  store.dispatch(forceLogout());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
