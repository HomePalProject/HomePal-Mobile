/// <reference types="jest" />
import { renderHook, act } from '@testing-library/react-native';
import { usePantry } from '../usePantry';
import { useAppDispatch, useAppSelector } from '@/src/store';
import {
  fetchPantryData,
  addPantryItemThunk,
  updatePantryItemThunk,
  deletePantryItemThunk,
  clearPantryError,
} from '@/src/store/slices/pantrySlice';

jest.mock('@/src/store', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('@/src/store/slices/pantrySlice', () => ({
  fetchPantryData: jest.fn(),
  addPantryItemThunk: jest.fn(),
  updatePantryItemThunk: jest.fn(),
  deletePantryItemThunk: jest.fn(),
  clearPantryError: jest.fn(),
}));

jest.mock('@/src/services', () => ({
  pantryService: {
    scanPantryImage: jest.fn(),
  },
}));

describe('usePantry hook', () => {
  let mockDispatch: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({}),
    });
    (useAppDispatch as any).mockReturnValue(mockDispatch);
    (useAppSelector as any).mockReturnValue({
      items: [],
      categories: [],
      measuringUnits: [],
      isLoading: false,
      error: null,
    });
  });

  it('should return default states', () => {
    const { result } = renderHook(() => usePantry()) as any;
    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should dispatch fetchPantryData on loadPantry', () => {
    const { result } = renderHook(() => usePantry()) as any;
    act(() => {
      result.current.loadPantry();
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(fetchPantryData).toHaveBeenCalled();
  });

  it('should dispatch addPantryItemThunk on addItem', () => {
    const { result } = renderHook(() => usePantry()) as any;
    const payload = {
      name: 'Milk',
      quantity: 2,
      categoryId: '1',
      measuringUnitId: '1',
      expireDate: null,
    };
    act(() => {
      result.current.addItem(payload);
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(addPantryItemThunk).toHaveBeenCalledWith(payload);
  });

  it('should dispatch updatePantryItemThunk on editItem', () => {
    const { result } = renderHook(() => usePantry()) as any;
    const payload = {
      name: 'Milk',
      quantity: 3,
      categoryId: '1',
      measuringUnitId: '1',
      expireDate: null,
    };
    act(() => {
      result.current.editItem('123', payload);
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(updatePantryItemThunk).toHaveBeenCalledWith({ id: '123', payload });
  });

  it('should dispatch deletePantryItemThunk on removeItem', () => {
    const { result } = renderHook(() => usePantry()) as any;
    act(() => {
      result.current.removeItem('123');
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(deletePantryItemThunk).toHaveBeenCalledWith('123');
  });

  it('should dispatch clearPantryError on clearError', () => {
    const { result } = renderHook(() => usePantry()) as any;
    act(() => {
      result.current.clearError();
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(clearPantryError).toHaveBeenCalled();
  });
});
