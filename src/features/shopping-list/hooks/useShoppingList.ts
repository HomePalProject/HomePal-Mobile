import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store';
import {
  fetchShoppingListData,
  addShoppingListItemThunk,
  updateShoppingListItemThunk,
  deleteShoppingListItemThunk,
  toggleShoppingListItemThunk,
  clearPurchasedItemsThunk,
  clearShoppingListError,
  optimisticToggle,
} from '@/src/store/slices/shoppingListSlice';
import { CreateShoppingListItemRequest, UpdateShoppingListItemRequest } from '@/src/types/api';

/**
 * Custom hook to access Shopping List Redux state and operations.
 */
export function useShoppingList() {
  const dispatch = useAppDispatch();
  const { items, categories, measuringUnits, isLoading, error } = useAppSelector(
    (state) => state.shoppingList
  );

  const loadShoppingList = useCallback(() => {
    return dispatch(fetchShoppingListData()).unwrap();
  }, [dispatch]);

  const addItem = useCallback(
    (payload: CreateShoppingListItemRequest) => {
      return dispatch(addShoppingListItemThunk(payload)).unwrap();
    },
    [dispatch]
  );

  const editItem = useCallback(
    (id: string, payload: UpdateShoppingListItemRequest) => {
      return dispatch(updateShoppingListItemThunk({ id, payload })).unwrap();
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (id: string) => {
      return dispatch(deleteShoppingListItemThunk(id)).unwrap();
    },
    [dispatch]
  );

  const toggleItem = useCallback(
    (id: string) => {
      dispatch(optimisticToggle(id));
      return dispatch(toggleShoppingListItemThunk(id)).unwrap();
    },
    [dispatch]
  );

  const clearPurchased = useCallback(() => {
    return dispatch(clearPurchasedItemsThunk()).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearShoppingListError());
  }, [dispatch]);

  return {
    items,
    categories,
    measuringUnits,
    isLoading,
    error,
    loadShoppingList,
    addItem,
    editItem,
    removeItem,
    toggleItem,
    clearPurchased,
    clearError,
  };
}
