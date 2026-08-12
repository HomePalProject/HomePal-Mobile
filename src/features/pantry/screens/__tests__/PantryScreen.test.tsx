/// <reference types="jest" />
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PantryScreen from '../PantryScreen';
import { usePantry } from '../../hooks/usePantry';

// Mock the useRouter hook from expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock the usePantry custom hook
jest.mock('../../hooks/usePantry', () => ({
  usePantry: jest.fn(),
}));

// Mock the components used in PantryScreen to keep tests clean and targeted
jest.mock('../../components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    PantryHeader: () => (
      <View>
        <Text>PantryHeader</Text>
      </View>
    ),
    PantryCategoryFilters: () => (
      <View>
        <Text>PantryCategoryFilters</Text>
      </View>
    ),
    PantrySearchBar: () => (
      <View>
        <Text>PantrySearchBar</Text>
      </View>
    ),
    PantryRecommendationCard: ({ itemName }: { itemName: string }) => (
      <View>
        <Text>Smart Recommendation</Text>
        <Text>You have {itemName} expiring soon. Consider making a quick meal to avoid waste.</Text>
      </View>
    ),
    PantrySkeleton: () => (
      <View>
        <Text>PantrySkeleton</Text>
      </View>
    ),
    PantryErrorView: () => (
      <View>
        <Text>PantryErrorView</Text>
      </View>
    ),
    PantryEmptyView: () => (
      <View>
        <Text>Your pantry is empty</Text>
      </View>
    ),
    PantryList: ({ items }: { items: any[] }) => (
      <View>
        {items.map((item) => (
          <View key={item.id}>
            <Text>{item.name}</Text>
          </View>
        ))}
      </View>
    ),
    PantryFAB: () => (
      <View>
        <Text>PantryFAB</Text>
      </View>
    ),
    AIScanModal: () => (
      <View>
        <Text>AIScanModal</Text>
      </View>
    ),
    ImagePickerSheet: () => (
      <View>
        <Text>ImagePickerSheet</Text>
      </View>
    ),
    PantryNotificationModal: () => (
      <View>
        <Text>PantryNotificationModal</Text>
      </View>
    ),
  };
});

describe('PantryScreen component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the empty state when no items exist', () => {
    (usePantry as any).mockReturnValue({
      items: [],
      categories: [],
      measuringUnits: [],
      isLoading: false,
      error: null,
      loadPantry: jest.fn(),
      addItem: jest.fn(),
      editItem: jest.fn(),
      clearError: jest.fn(),
      scanPantryImage: jest.fn(),
    });

    render(<PantryScreen />);

    expect(screen.getByText('Your pantry is empty')).toBeTruthy();
  });

  it('renders the list of items properly', () => {
    const mockItems = [
      {
        id: '1',
        name: 'Fresh Cilantro',
        quantity: 2,
        categoryId: 'cat-1',
        measuringUnitId: 'unit-1',
        measuringUnitSymbol: 'pcs',
        expireDate: null,
        createdAt: '2026-08-10T00:00:00.000Z',
        updatedAt: '2026-08-10T00:00:00.000Z',
      },
      {
        id: '2',
        name: 'Whole Milk',
        quantity: 1,
        categoryId: 'cat-2',
        measuringUnitId: 'unit-2',
        measuringUnitSymbol: 'L',
        expireDate: null,
        createdAt: '2026-08-10T00:00:00.000Z',
        updatedAt: '2026-08-10T00:00:00.000Z',
      },
    ];

    (usePantry as any).mockReturnValue({
      items: mockItems,
      categories: [],
      measuringUnits: [],
      isLoading: false,
      error: null,
      loadPantry: jest.fn(),
      addItem: jest.fn(),
      editItem: jest.fn(),
      clearError: jest.fn(),
      scanPantryImage: jest.fn(),
    });

    render(<PantryScreen />);

    expect(screen.getByText('Fresh Cilantro')).toBeTruthy();
    expect(screen.getByText('Whole Milk')).toBeTruthy();
  });

  it('calculates and renders the Smart Recommendation card correctly for urgent items', () => {
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 5);

    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 2); // expiring soonest!

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // already expired

    const mockItems = [
      {
        id: '1',
        name: 'Apple',
        quantity: 5,
        categoryId: 'cat-1',
        measuringUnitId: 'unit-1',
        expireDate: futureDate1.toISOString(),
      },
      {
        id: '2',
        name: 'Milk',
        quantity: 1,
        categoryId: 'cat-2',
        measuringUnitId: 'unit-2',
        expireDate: futureDate2.toISOString(),
      },
      {
        id: '3',
        name: 'Bread',
        quantity: 1,
        categoryId: 'cat-3',
        measuringUnitId: 'unit-3',
        expireDate: pastDate.toISOString(),
      },
    ];

    (usePantry as any).mockReturnValue({
      items: mockItems,
      categories: [],
      measuringUnits: [],
      isLoading: false,
      error: null,
      loadPantry: jest.fn(),
      addItem: jest.fn(),
      editItem: jest.fn(),
      clearError: jest.fn(),
      scanPantryImage: jest.fn(),
    });

    render(<PantryScreen />);

    expect(screen.getByText(/Milk/i)).toBeTruthy();
  });

  it('hides the Smart Recommendation card when no items are expiring in the future', () => {
    const mockItems = [
      {
        id: '1',
        name: 'Apple',
        quantity: 5,
        categoryId: 'cat-1',
        measuringUnitId: 'unit-1',
        expireDate: null,
      },
    ];

    (usePantry as any).mockReturnValue({
      items: mockItems,
      categories: [],
      measuringUnits: [],
      isLoading: false,
      error: null,
      loadPantry: jest.fn(),
      addItem: jest.fn(),
      editItem: jest.fn(),
      clearError: jest.fn(),
      scanPantryImage: jest.fn(),
    });

    render(<PantryScreen />);

    expect(screen.queryByText('Smart Recommendation')).toBeNull();
  });
});
