import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface PantrySearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
}

export function PantrySearchBar({ value, onChangeText, onFilterPress }: PantrySearchBarProps) {
  return (
    <View className="flex-row items-center gap-spacing-8 bg-surface-background px-spacing-16 py-spacing-8">
      {/* Search Input Box */}
      <View className="bg-surface-surfaceVariant flex-1 flex-row items-center gap-spacing-8 rounded-radius-full border border-surface-border px-spacing-16 py-spacing-8">
        <Icon as={Search} size={18} className="text-text-secondary" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search pantry..."
          placeholderTextColor="#6D6862"
          className="text-body flex-1 p-0 font-cairo text-text-primary"
        />
      </View>

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
