import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  activeRoute: string;
}

const initialState: UiState = {
  activeRoute: 'household',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveRoute: (state, action: PayloadAction<string>) => {
      state.activeRoute = action.payload;
    },
  },
});

export const { setActiveRoute } = uiSlice.actions;

export default uiSlice.reducer;
