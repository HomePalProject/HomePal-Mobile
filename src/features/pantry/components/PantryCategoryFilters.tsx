import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ProductCategoryResponse } from '@/src/types/api';

interface PantryCategoryFiltersProps {
  categories: ProductCategoryResponse[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function PantryCategoryFilters({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: PantryCategoryFiltersProps) {
  return (
    <View className="bg-surface-background py-spacing-8">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        <Pressable
          onPress={() => onSelectCategory('all')}
          className={`rounded-radius-full px-spacing-16 py-spacing-8 ${
            selectedCategoryId === 'all'
              ? 'bg-brand-primary'
              : 'bg-surface-surfaceVariant border border-surface-border'
          }`}>
          <Text
            className={`text-body font-cairo font-bold ${
              selectedCategoryId === 'all' ? 'text-text-inverse' : 'text-text-secondary'
            }`}>
            All
          </Text>
        </Pressable>

        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <Pressable
              key={category.id}
              onPress={() => onSelectCategory(category.id)}
              className={`rounded-radius-full px-spacing-16 py-spacing-8 ${
                isSelected
                  ? 'bg-brand-primary'
                  : 'bg-surface-surfaceVariant border border-surface-border'
              }`}>
              <Text
                className={`text-body font-cairo font-bold ${
                  isSelected ? 'text-text-inverse' : 'text-text-secondary'
                }`}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
