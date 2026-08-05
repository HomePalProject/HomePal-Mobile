import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer, { forceLogout } from '@/src/store/slices/authSlice';
import { registerOnUnauthorizedCallback } from '@/src/services/api/client';

import uiReducer from '@/src/store/slices/uiSlice';
import profileReducer from '@/src/store/slices/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Register callback so Axios interceptor can dispatch logout on 401 token refresh failure
registerOnUnauthorizedCallback(() => {
  store.dispatch(forceLogout());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
