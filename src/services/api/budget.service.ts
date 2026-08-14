import { apiClient } from './client';
import { ApiResponse } from '@/src/types/api';

export interface ExpenseResponse {
  id: string;
  householdId: string;
  budgetId: string | null;
  title: string;
  amount: number;
  expenseDate: string;
  createdAt: string;
}

export interface MonthlyBudgetSummaryResponse {
  budgetId: string | null;
  householdId: string;
  year: number;
  month: number;
  budgetAmount: number;
  totalSpent: number;
  remainingAmount: number;
  notes: string | null;
  totalExpensesCount: number;
  recentExpenses: ExpenseResponse[];
}

export interface SetMonthlyBudgetRequest {
  year: number;
  month: number;
  targetAmount: number;
  notes?: string | null;
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  expenseDate?: string | null;
}

export const budgetService = {
  /**
   * GET /api/budget/summary?year={year}&month={month}
   * Fetches monthly budget summary.
   */
  async getBudgetSummary(
    year: number,
    month: number
  ): Promise<ApiResponse<MonthlyBudgetSummaryResponse>> {
    const response = await apiClient.get<ApiResponse<MonthlyBudgetSummaryResponse>>(
      '/api/budget/summary',
      {
        params: { year, month },
      }
    );
    return response.data;
  },

  /**
   * POST /api/budget/target
   * Sets budget target for a specific month.
   */
  async setBudgetTarget(
    data: SetMonthlyBudgetRequest
  ): Promise<ApiResponse<MonthlyBudgetSummaryResponse>> {
    const response = await apiClient.post<ApiResponse<MonthlyBudgetSummaryResponse>>(
      '/api/budget/target',
      data
    );
    return response.data;
  },

  /**
   * GET /api/budget/expenses?year={year}&month={month}
   * Fetches expenses for a specific month.
   */
  async getExpenses(year: number, month: number): Promise<ApiResponse<ExpenseResponse[]>> {
    const response = await apiClient.get<ApiResponse<ExpenseResponse[]>>('/api/budget/expenses', {
      params: { year, month },
    });
    return response.data;
  },

  /**
   * POST /api/budget/expenses
   * Creates a new expense.
   */
  async createExpense(data: CreateExpenseRequest): Promise<ApiResponse<ExpenseResponse>> {
    const response = await apiClient.post<ApiResponse<ExpenseResponse>>(
      '/api/budget/expenses',
      data
    );
    return response.data;
  },

  /**
   * DELETE /api/budget/expenses/{id}
   * Deletes an expense by ID.
   */
  async deleteExpense(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    const response = await apiClient.delete<ApiResponse<Record<string, unknown>>>(
      `/api/budget/expenses/${id}`
    );
    return response.data;
  },
};
