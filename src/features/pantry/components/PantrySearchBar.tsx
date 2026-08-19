import React from 'react';
import { View, Pressable } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { SearchBar } from '@/src/components/ui/search-bar';
import { useTranslation } from 'react-i18next';

interface PantrySearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
}

export function PantrySearchBar({ value = '', onChangeText, onFilterPress }: PantrySearchBarProps) {
  const { t } = useTranslation('pantry');

  return (
    <View className="flex-row items-center gap-spacing-8 bg-surface-background px-spacing-16 py-spacing-8">
      {/* Search Input Box */}
      <SearchBar
        value={value}
        onChangeText={onChangeText || (() => {})}
        placeholder={t('searchPlaceholder')}
        containerClassName="flex-1"
      />

      {/* Filter Button */}
      <Pressable
        onPress={onFilterPress}
        className="bg-surface-surfaceVariant h-11 w-11 items-center justify-center rounded-radius-full border border-surface-border active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="Filter Options">
        <Icon as={SlidersHorizontal} size={18} className="text-text-primary" />
      </Pressable>
    </View>
  );
}
