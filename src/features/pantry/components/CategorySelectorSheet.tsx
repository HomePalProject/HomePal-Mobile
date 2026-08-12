import React, { useState, useMemo } from 'react';
import { View, Text, Modal, Pressable, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Search } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { ProductCategoryResponse } from '@/src/types/api';
import { CategoryRow, getCategoryIconConfig, CategoryIconConfig } from './CategoryRow';

export { getCategoryIconConfig, CategoryIconConfig };

export interface CategorySelectorSheetProps {
  visible: boolean;
  categories: ProductCategoryResponse[];
  selectedId?: string | null;
  onSelect: (category: ProductCategoryResponse) => void;
  onClose: () => void;
}

export function CategorySelectorSheet({
  visible,
  categories,
  selectedId,
  onSelect,
  onClose,
}: CategorySelectorSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [categories, searchQuery]);

  const handleSelect = (category: ProductCategoryResponse) => {
    onSelect(category);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <Pressable
          className="absolute inset-0 bg-surface-surface-variant"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close category selector"
        />

        {/* Bottom Sheet */}
        <SafeAreaView
          edges={['bottom']}
          className="h-[80%] w-full overflow-hidden rounded-t-radius-large bg-surface-surface pt-3">
          {/* Drag Handle */}
          <View className="pt-spacing-12 items-center pb-spacing-4">
            <View className="h-1.5 w-10 rounded-radius-full bg-surface-border" />
          </View>

          {/* Header */}
          <View className="py-spacing-12 flex-row items-center justify-between px-spacing-16">
            <Text className="text-heading-3 font-cairo font-bold text-text-primary">
              Select Category
            </Text>

            <Pressable
              onPress={onClose}
              className="bg-surface-surfaceVariant h-8 w-8 items-center justify-center rounded-radius-full active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="Close">
              <Icon as={X} size={16} className="text-text-secondary" />
            </Pressable>
          </View>

          {/* Search */}
          <View className="bg-surface-surfaceVariant px-spacing-12 py-spacing-10 mx-spacing-16 mb-spacing-16 flex-row items-center gap-spacing-8 rounded-radius-large border border-surface-border px-2">
            <Icon as={Search} size={16} className="text-text-secondary" />

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search categories..."
              className="text-body flex-1 font-cairo text-text-primary"
              autoCorrect={false}
            />
          </View>

          {/* Categories */}
          <FlatList
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
                  No categories found
                </Text>
              </View>
            )}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}
