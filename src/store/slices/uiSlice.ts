import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isDrawerOpen: boolean;
  activeRoute: string;
}

const initialState: UiState = {
  isDrawerOpen: false,
  activeRoute: 'household',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setActiveRoute: (state, action: PayloadAction<string>) => {
      state.activeRoute = action.payload;
    },
  },
});

export const { openDrawer, closeDrawer, toggleDrawer, setActiveRoute } = uiSlice.actions;

export default uiSlice.reducer;
