import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MealPlanResponse } from '@/src/types/api';
import { mealPlansApi, PaginatedMealPlans } from '@/src/services/api/meal-plans.service';

interface MealPlansState {
  latestPlan: MealPlanResponse | null;
  historyPlans: MealPlanResponse[];
  currentPlanDetails: MealPlanResponse | null;

  isLoadingLatest: boolean;
  isLoadingHistory: boolean;
  isLoadingDetails: boolean;
  isDeleting: boolean;

  error: string | null;

  pagination: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const initialState: MealPlansState = {
  latestPlan: null,
  historyPlans: [],
  currentPlanDetails: null,

  isLoadingLatest: false,
  isLoadingHistory: false,
  isLoadingDetails: false,
  isDeleting: false,

  error: null,

  pagination: {
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

export const fetchLatestMealPlan = createAsyncThunk(
  'mealPlans/fetchLatest',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mealPlansApi.getLatestMealPlan();
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No latest plan exists
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch latest meal plan');
    }
  }
);

export const fetchMealPlansHistory = createAsyncThunk(
  'mealPlans/fetchHistory',
  async ({ page = 1, limit = 5 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await mealPlansApi.getMealPlans(page, limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meal plans history');
    }
  }
);

export const fetchMealPlanById = createAsyncThunk(
  'mealPlans/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await mealPlansApi.getMealPlanById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meal plan details');
    }
  }
);

export const deleteMealPlan = createAsyncThunk(
  'mealPlans/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await mealPlansApi.deleteMealPlan(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete meal plan');
    }
  }
);

const mealPlansSlice = createSlice({
  name: 'mealPlans',
  initialState,
  reducers: {
    clearMealPlanDetails(state) {
      state.currentPlanDetails = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Latest
    builder.addCase(fetchLatestMealPlan.pending, (state) => {
      state.isLoadingLatest = true;
      state.error = null;
    });
    builder.addCase(fetchLatestMealPlan.fulfilled, (state, action) => {
      state.isLoadingLatest = false;
      state.latestPlan = action.payload;
    });
    builder.addCase(fetchLatestMealPlan.rejected, (state, action) => {
      state.isLoadingLatest = false;
      state.error = action.payload as string;
    });

    // Fetch History
    builder.addCase(fetchMealPlansHistory.pending, (state) => {
      state.isLoadingHistory = true;
      state.error = null;
    });
    builder.addCase(fetchMealPlansHistory.fulfilled, (state, action) => {
      state.isLoadingHistory = false;
      if (action.payload) {
        state.historyPlans = action.payload.items;
        state.pagination = {
          pageNumber: action.payload.pageNumber,
          pageSize: 5,
          totalPages: action.payload.totalPages,
          hasNextPage: action.payload.hasNextPage,
          hasPreviousPage: action.payload.hasPreviousPage,
        };
      }
    });
    builder.addCase(fetchMealPlansHistory.rejected, (state, action) => {
      state.isLoadingHistory = false;
      state.error = action.payload as string;
    });

    // Fetch By ID (Details)
    builder.addCase(fetchMealPlanById.pending, (state) => {
      state.isLoadingDetails = true;
      state.error = null;
    });
    builder.addCase(fetchMealPlanById.fulfilled, (state, action) => {
      state.isLoadingDetails = false;
      state.currentPlanDetails = action.payload;
    });
    builder.addCase(fetchMealPlanById.rejected, (state, action) => {
      state.isLoadingDetails = false;
      state.error = action.payload as string;
    });

    // Delete
    builder.addCase(deleteMealPlan.pending, (state) => {
      state.isDeleting = true;
    });
    builder.addCase(deleteMealPlan.fulfilled, (state, action) => {
      state.isDeleting = false;
      // Remove from history
      state.historyPlans = state.historyPlans.filter((p) => p.id !== action.payload);
      // Remove from latest if it was the latest
      if (state.latestPlan?.id === action.payload) {
        state.latestPlan = null;
      }
    });
    builder.addCase(deleteMealPlan.rejected, (state, action) => {
      state.isDeleting = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearMealPlanDetails } = mealPlansSlice.actions;
export default mealPlansSlice.reducer;
