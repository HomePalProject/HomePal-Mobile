import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  budgetService,
  ExpenseResponse,
  MonthlyBudgetSummaryResponse,
  SetMonthlyBudgetRequest,
  CreateExpenseRequest,
} from '@/src/services';
import { baseApi } from '@/src/services/api/baseApi';

export interface BudgetState {
  summary: MonthlyBudgetSummaryResponse | null;
  expenses: ExpenseResponse[];
  isLoading: boolean;
  error: string | null;
  setTargetLoading: boolean;
  createExpenseLoading: boolean;
  deleteExpenseLoading: boolean;
}

const initialState: BudgetState = {
  summary: null,
  expenses: [],
  isLoading: false,
  error: null,
  setTargetLoading: false,
  createExpenseLoading: false,
  deleteExpenseLoading: false,
};

/**
 * Thunk to fetch monthly budget summary.
 */
export const fetchBudgetSummary = createAsyncThunk(
  'budget/fetchBudgetSummary',
  async ({ year, month }: { year: number; month: number }, { rejectWithValue }) => {
    try {
      const response = await budgetService.getBudgetSummary(year, month);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch budget summary');
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch budget summary');
    }
  }
);

/**
 * Thunk to set budget target amount for a specific month.
 */
export const setBudgetTarget = createAsyncThunk(
  'budget/setBudgetTarget',
  async (payload: SetMonthlyBudgetRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await budgetService.setBudgetTarget(payload);
      if (response.success && response.data) {
        dispatch(baseApi.util.invalidateTags(['Overview']));
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to set budget target');
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to set budget target');
    }
  }
);

/**
 * Thunk to fetch expenses list for a specific month.
 */
export const fetchExpenses = createAsyncThunk(
  'budget/fetchExpenses',
  async ({ year, month }: { year: number; month: number }, { rejectWithValue }) => {
    try {
      const response = await budgetService.getExpenses(year, month);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch expenses');
    }
  }
);

/**
 * Thunk to create a new expense log.
 */
export const createExpense = createAsyncThunk(
  'budget/createExpense',
  async (payload: CreateExpenseRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await budgetService.createExpense(payload);
      if (response.success && response.data) {
        dispatch(baseApi.util.invalidateTags(['Overview']));
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to create expense');
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to create expense');
    }
  }
);

/**
 * Thunk to delete an expense log by ID.
 */
export const deleteExpense = createAsyncThunk(
  'budget/deleteExpense',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await budgetService.deleteExpense(id);
      if (response.success) {
        dispatch(baseApi.util.invalidateTags(['Overview']));
        return id;
      }
      return rejectWithValue(response.message || 'Failed to delete expense');
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to delete expense');
    }
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearBudgetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBudgetSummary
      .addCase(fetchBudgetSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgetSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchBudgetSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Failed to fetch budget summary';
      })

      // setBudgetTarget
      .addCase(setBudgetTarget.pending, (state) => {
        state.setTargetLoading = true;
        state.error = null;
      })
      .addCase(setBudgetTarget.fulfilled, (state, action) => {
        state.setTargetLoading = false;
        state.summary = action.payload;
      })
      .addCase(setBudgetTarget.rejected, (state, action) => {
        state.setTargetLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Failed to set budget target';
      })

      // fetchExpenses
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Failed to fetch expenses';
      })

      // createExpense
      .addCase(createExpense.pending, (state) => {
        state.createExpenseLoading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.createExpenseLoading = false;
        state.expenses.unshift(action.payload);

        // Optimistically update summary metrics to avoid full refetch delay
        if (state.summary) {
          state.summary.totalSpent += action.payload.amount;
          state.summary.remainingAmount -= action.payload.amount;
          state.summary.totalExpensesCount += 1;
          state.summary.recentExpenses = [action.payload, ...state.summary.recentExpenses];
          if (state.summary.recentExpenses.length > 5) {
            state.summary.recentExpenses.pop();
          }
        }
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.createExpenseLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Failed to create expense';
      })

      // deleteExpense
      .addCase(deleteExpense.pending, (state) => {
        state.deleteExpenseLoading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.deleteExpenseLoading = false;
        const deletedId = action.payload;
        const targetExpense = state.expenses.find((exp) => exp.id === deletedId);

        state.expenses = state.expenses.filter((exp) => exp.id !== deletedId);

        // Optimistically update summary metrics
        if (state.summary && targetExpense) {
          state.summary.totalSpent = Math.max(0, state.summary.totalSpent - targetExpense.amount);
          state.summary.remainingAmount += targetExpense.amount;
          state.summary.totalExpensesCount = Math.max(0, state.summary.totalExpensesCount - 1);
          state.summary.recentExpenses = state.summary.recentExpenses.filter(
            (exp) => exp.id !== deletedId
          );
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.deleteExpenseLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Failed to delete expense';
      });
  },
});

export const { clearBudgetError } = budgetSlice.actions;
export default budgetSlice.reducer;
