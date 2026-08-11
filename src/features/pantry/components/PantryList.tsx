import React from 'react';
import { View, FlatList } from 'react-native';
import { PantryItemResponse } from '@/src/types/api';
import { PantryItemCard } from './PantryItemCard';

interface PantryListProps {
  items: PantryItemResponse[];
  onItemPress?: (item: PantryItemResponse) => void;
}

export function PantryList({ items, onItemPress }: PantryListProps) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        marginBottom: 16,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 32,
      }}
      renderItem={({ item }) => <PantryItemCard item={item} onPress={onItemPress} />}
    />
  );
}
