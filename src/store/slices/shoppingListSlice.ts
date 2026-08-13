import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  ShoppingListItemResponse,
  ProductCategoryResponse,
  MeasuringUnitResponse,
  CreateShoppingListItemRequest,
  UpdateShoppingListItemRequest,
} from '@/src/types/api';
import { shoppingListService, categoryService, unitService } from '@/src/services';

export interface ShoppingListState {
  items: ShoppingListItemResponse[];
  categories: ProductCategoryResponse[];
  measuringUnits: MeasuringUnitResponse[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ShoppingListState = {
  items: [],
  categories: [],
  measuringUnits: [],
  isLoading: false,
  error: null,
};

export const fetchShoppingListData = createAsyncThunk(
  'shoppingList/fetchShoppingListData',
  async (_, { rejectWithValue }) => {
    try {
      const [items, categories, measuringUnits] = await Promise.all([
        shoppingListService.getShoppingListItems(),
        categoryService.getCategories(),
        unitService.getMeasuringUnits(),
      ]);
      return { items, categories, measuringUnits };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch shopping list data');
    }
  }
);

export const addShoppingListItemThunk = createAsyncThunk(
  'shoppingList/addShoppingListItem',
  async (payload: CreateShoppingListItemRequest, { rejectWithValue }) => {
    try {
      const newItem = await shoppingListService.createShoppingListItem(payload);
      return newItem;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to add shopping list item');
    }
  }
);

export const updateShoppingListItemThunk = createAsyncThunk(
  'shoppingList/updateShoppingListItem',
  async (
    { id, payload }: { id: string; payload: UpdateShoppingListItemRequest },
    { rejectWithValue }
  ) => {
    try {
      const updatedItem = await shoppingListService.updateShoppingListItem(id, payload);
      return updatedItem;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to update shopping list item');
    }
  }
);

export const deleteShoppingListItemThunk = createAsyncThunk(
  'shoppingList/deleteShoppingListItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await shoppingListService.deleteShoppingListItem(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to delete shopping list item');
    }
  }
);

export const toggleShoppingListItemThunk = createAsyncThunk(
  'shoppingList/toggleShoppingListItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const updatedItem = await shoppingListService.toggleShoppingListItem(id);
      return updatedItem;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to toggle item');
    }
  }
);

export const clearPurchasedItemsThunk = createAsyncThunk(
  'shoppingList/clearPurchasedItems',
  async (_, { rejectWithValue }) => {
    try {
      await shoppingListService.clearPurchasedItems();
      return true;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to clear purchased items');
    }
  }
);

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    clearShoppingListError: (state) => {
      state.error = null;
    },
    optimisticToggle: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.items[index].isPurchased = !state.items[index].isPurchased;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShoppingListData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShoppingListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.categories = action.payload.categories;
        state.measuringUnits = action.payload.measuringUnits;
      })
      .addCase(fetchShoppingListData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to fetch shopping list data';
      })

      .addCase(addShoppingListItemThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(addShoppingListItemThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(addShoppingListItemThunk.rejected, (state, action) => {
        state.error =
          (action.payload as string) || action.error.message || 'Failed to add shopping list item';
      })

      .addCase(updateShoppingListItemThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(updateShoppingListItemThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex((item) => item.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      .addCase(updateShoppingListItemThunk.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to update shopping list item';
      })

      .addCase(deleteShoppingListItemThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteShoppingListItemThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteShoppingListItemThunk.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to delete shopping list item';
      })

      .addCase(toggleShoppingListItemThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex((item) => item.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      .addCase(toggleShoppingListItemThunk.rejected, (state, action) => {
        const id = action.meta.arg;
        const index = state.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          state.items[index].isPurchased = !state.items[index].isPurchased;
        }
        state.error = (action.payload as string) || action.error.message || 'Failed to toggle item';
      })

      .addCase(clearPurchasedItemsThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(clearPurchasedItemsThunk.fulfilled, (state) => {
        state.items = state.items.filter((item) => !item.isPurchased);
      })
      .addCase(clearPurchasedItemsThunk.rejected, (state, action) => {
        state.error =
          (action.payload as string) || action.error.message || 'Failed to clear purchased items';
      });
  },
});

export const { clearShoppingListError, optimisticToggle } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
