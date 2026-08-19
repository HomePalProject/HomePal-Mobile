import React, { forwardRef, useState, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { X, Search } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { ProductCategoryResponse } from '@/src/types/api';
import { CategoryRow, getCategoryIconConfig, CategoryIconConfig } from './CategoryRow';
import { AppBottomSheet } from '@/src/components/ui/bottom-sheet';
import { BottomSheetModal, BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';

export { getCategoryIconConfig, CategoryIconConfig };

export interface CategorySelectorSheetProps {
  categories: ProductCategoryResponse[];
  selectedId?: string | null;
  onSelect: (category: ProductCategoryResponse) => void;
  onClose?: () => void;
}

export const CategorySelectorSheet = forwardRef<BottomSheetModal, CategorySelectorSheetProps>(
  ({ categories, selectedId, onSelect, onClose }, ref) => {
    const { t } = useTranslation('pantry');
    const [searchQuery, setSearchQuery] = useState('');

    const dismiss = () => {
      if (ref && typeof ref === 'object') {
        ref.current?.dismiss();
      }
    };

    const filtered = useMemo(() => {
      if (!searchQuery.trim()) return categories;
      return categories.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [categories, searchQuery]);

    const handleSelect = (category: ProductCategoryResponse) => {
      onSelect(category);
      dismiss();
    };

    return (
      <AppBottomSheet ref={ref} onDismiss={onClose} enablePanDownToClose snapPoints={['80%']}>
        {/* Header */}
        <View className="py-spacing-12 flex-row items-center justify-between px-spacing-16">
          <Text className="text-heading-3 font-cairo font-bold text-text-primary">
            {t('selectCategory', 'Select Category')}
          </Text>

          <Pressable
            onPress={dismiss}
            className="bg-surface-surfaceVariant h-8 w-8 items-center justify-center rounded-radius-full active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="Close">
            <Icon as={X} size={16} className="text-text-secondary" />
          </Pressable>
        </View>

        {/* Search */}
        <View className="bg-surface-surfaceVariant px-spacing-12 py-spacing-10 mx-spacing-16 mb-spacing-16 flex-row items-center gap-spacing-8 rounded-radius-large border border-surface-border px-2">
          <Icon as={Search} size={16} className="text-text-secondary" />

          <BottomSheetTextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('searchCategories', 'Search categories...')}
            className="text-body flex-1 font-cairo text-text-primary"
            autoCorrect={false}
          />
        </View>

        {/* Categories */}
        <BottomSheetFlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryRow
              item={item}
              isSelected={item.id === selectedId}
              onPress={() => handleSelect(item)}
            />
          )}
          ItemSeparatorComponent={() => <View className="mx-spacing-16 h-px bg-surface-border" />}
          ListEmptyComponent={() => (
            <View className="items-center py-spacing-48">
              <Text className="text-body font-cairo text-text-secondary">
                {t('noCategoriesFound', 'No categories found')}
              </Text>
            </View>
          )}
        />
      </AppBottomSheet>
    );
  }
);

CategorySelectorSheet.displayName = 'CategorySelectorSheet';
