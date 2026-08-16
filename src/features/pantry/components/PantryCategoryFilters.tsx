import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ProductCategoryResponse } from '@/src/types/api';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('pantry');

  return (
    <View className="bg-surface-background py-spacing-8">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        <Pressable
          onPress={() => onSelectCategory('all')}
          className={`rounded-radius-full px-spacing-16 py-spacing-8 active:scale-95 active:opacity-80 ${
            selectedCategoryId === 'all'
              ? 'bg-brand-primary'
              : 'bg-surface-surfaceVariant border border-surface-border'
          }`}>
          <Text
            className={`text-body font-cairo font-bold ${
              selectedCategoryId === 'all' ? 'text-text-inverse' : 'text-text-secondary'
            }`}>
            {t('filterAll')}
          </Text>
        </Pressable>

        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <Pressable
              key={category.id}
              onPress={() => onSelectCategory(category.id)}
              className={`rounded-radius-full px-spacing-16 py-spacing-8 active:scale-95 active:opacity-80 ${
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
