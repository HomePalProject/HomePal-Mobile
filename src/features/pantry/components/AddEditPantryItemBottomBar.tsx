import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface AddEditPantryItemBottomBarProps {
  isFormValid: boolean;
  isLoading: boolean;
  onSubmitPress: () => void;
}

export function AddEditPantryItemBottomBar({
  isFormValid,
  isLoading,
  onSubmitPress,
}: AddEditPantryItemBottomBarProps) {
  return (
    <View className="border-t border-surface-border bg-surface-surface px-spacing-16 py-spacing-4">
      <Pressable
        onPress={onSubmitPress}
        disabled={!isFormValid || isLoading}
        className={`flex-row items-center justify-center gap-spacing-8 rounded-radius-full py-spacing-16 ${
          isFormValid && !isLoading ? 'bg-brand-primary' : 'bg-surface-surfaceVariant opacity-50'
        }`}
        accessibilityRole="button"
        accessibilityLabel="Add item to pantry">
        <Icon
          as={Plus}
          size={18}
          className={
            isFormValid && !isLoading ? 'text-brand-primary-container' : 'text-text-disabled'
          }
        />
        <Text
          className={`text-body font-cairo font-bold ${
            isFormValid && !isLoading ? 'text-brand-primary-container' : 'text-text-disabled'
          }`}>
          {isLoading ? 'Saving...' : 'Add to Pantry'}
        </Text>
      </Pressable>
    </View>
  );
}
