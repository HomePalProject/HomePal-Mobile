import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  PantryItemResponse,
  ProductCategoryResponse,
  MeasuringUnitResponse,
  CreatePantryItemRequest,
  UpdatePantryItemRequest,
} from '@/src/types/api';
import { pantryService, categoryService, unitService } from '@/src/services';
import { baseApi } from '@/src/services/api/baseApi';

export interface PantryState {
  items: PantryItemResponse[];
  categories: ProductCategoryResponse[];
  measuringUnits: MeasuringUnitResponse[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialState: PantryState = {
  items: [],
  categories: [],
  measuringUnits: [],
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const fetchPantryData = createAsyncThunk(
  'pantry/fetchPantryData',
  async (_, { rejectWithValue }) => {
    try {
      const [items, categories, measuringUnits] = await Promise.all([
        pantryService.getPantryItems(),
        categoryService.getCategories(),
        unitService.getMeasuringUnits(),
      ]);
      return { items, categories, measuringUnits };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch pantry data');
    }
  }
);

export const addPantryItemThunk = createAsyncThunk(
  'pantry/addPantryItem',
  async (payload: CreatePantryItemRequest, { dispatch, rejectWithValue }) => {
    try {
      const newItem = await pantryService.createPantryItem(payload);
      dispatch(baseApi.util.invalidateTags(['Overview']));
      return newItem;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to add pantry item');
    }
  }
);

export const updatePantryItemThunk = createAsyncThunk(
  'pantry/updatePantryItem',
  async (
    { id, payload }: { id: string; payload: UpdatePantryItemRequest },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const updatedItem = await pantryService.updatePantryItem(id, payload);
      dispatch(baseApi.util.invalidateTags(['Overview']));
      return updatedItem;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to update pantry item');
    }
  }
);

export const deletePantryItemThunk = createAsyncThunk(
  'pantry/deletePantryItem',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await pantryService.deletePantryItem(id);
      dispatch(baseApi.util.invalidateTags(['Overview']));
      return id;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to delete pantry item');
    }
  }
);

const pantrySlice = createSlice({
  name: 'pantry',
  initialState,
  reducers: {
    clearPantryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPantryData
      .addCase(fetchPantryData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPantryData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.items = action.payload.items;
        state.categories = action.payload.categories;
        state.measuringUnits = action.payload.measuringUnits;
      })
      .addCase(fetchPantryData.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error =
          (action.payload as string) || action.error.message || 'Failed to fetch pantry data';
      })

      // addPantryItemThunk
      .addCase(addPantryItemThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPantryItemThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(addPantryItemThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Failed to add pantry item';
      })

      // updatePantryItemThunk
      .addCase(updatePantryItemThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePantryItemThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.items.findIndex((item) => item.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      .addCase(updatePantryItemThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Failed to update pantry item';
      })

      // deletePantryItemThunk
      .addCase(deletePantryItemThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePantryItemThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deletePantryItemThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Failed to delete pantry item';
      });
  },
});

export const { clearPantryError } = pantrySlice.actions;
export default pantrySlice.reducer;
