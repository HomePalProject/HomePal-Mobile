import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store';
import {
  fetchBudgetSummary,
  setBudgetTarget,
  fetchExpenses,
  createExpense,
  deleteExpense,
  clearBudgetError,
} from '@/src/store/slices/budgetSlice';
import { SetMonthlyBudgetRequest, CreateExpenseRequest } from '@/src/services';

/**
 * Custom hook to access Budget Redux state and operations.
 */
export function useBudget() {
  const dispatch = useAppDispatch();

  const {
    summary,
    expenses,
    isLoading,
    error,
    setTargetLoading,
    createExpenseLoading,
    deleteExpenseLoading,
  } = useAppSelector((state) => state.budget);

  const getSummary = useCallback(
    (year: number, month: number) => {
      return dispatch(fetchBudgetSummary({ year, month })).unwrap();
    },
    [dispatch]
  );

  const setTarget = useCallback(
    (payload: SetMonthlyBudgetRequest) => {
      return dispatch(setBudgetTarget(payload)).unwrap();
    },
    [dispatch]
  );

  const getExpensesList = useCallback(
    (year: number, month: number) => {
      return dispatch(fetchExpenses({ year, month })).unwrap();
    },
    [dispatch]
  );

  const addExpense = useCallback(
    (payload: CreateExpenseRequest) => {
      return dispatch(createExpense(payload)).unwrap();
    },
    [dispatch]
  );

  const removeExpense = useCallback(
    (id: string) => {
      return dispatch(deleteExpense(id)).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearBudgetError());
  }, [dispatch]);

  return {
    summary,
    expenses,
    isLoading,
    error,
    setTargetLoading,
    createExpenseLoading,
    deleteExpenseLoading,
    getSummary,
    setTarget,
    getExpensesList,
    addExpense,
    removeExpense,
    clearError,
  };
}
