import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store';
import {
  fetchPantryData,
  addPantryItemThunk,
  updatePantryItemThunk,
  deletePantryItemThunk,
  clearPantryError,
} from '@/src/store/slices/pantrySlice';
import { CreatePantryItemRequest, UpdatePantryItemRequest } from '@/src/types/api';

/**
 * Custom hook to access Pantry Redux state and operations.
 */
export function usePantry() {
  const dispatch = useAppDispatch();
  const { items, categories, measuringUnits, isLoading, error } = useAppSelector(
    (state) => state.pantry
  );

  const loadPantry = useCallback(() => {
    return dispatch(fetchPantryData()).unwrap();
  }, [dispatch]);

  const addItem = useCallback(
    (payload: CreatePantryItemRequest) => {
      return dispatch(addPantryItemThunk(payload)).unwrap();
    },
    [dispatch]
  );

  const editItem = useCallback(
    (id: string, payload: UpdatePantryItemRequest) => {
      return dispatch(updatePantryItemThunk({ id, payload })).unwrap();
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (id: string) => {
      return dispatch(deletePantryItemThunk(id)).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearPantryError());
  }, [dispatch]);

  return {
    items,
    categories,
    measuringUnits,
    isLoading,
    error,
    loadPantry,
    addItem,
    editItem,
    removeItem,
    clearError,
  };
}
