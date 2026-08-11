import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface AddEditPantryItemHeaderProps {
  isEditMode: boolean;
  isFormValid: boolean;
  isLoading: boolean;
  onBackPress: () => void;
  onSubmitPress: () => void;
}

export function AddEditPantryItemHeader({
  isEditMode,
  isFormValid,
  isLoading,
  onBackPress,
  onSubmitPress,
}: AddEditPantryItemHeaderProps) {
  return (
    <View className="py-spacing-12 flex-row items-center justify-between border-b border-surface-border bg-surface-surface px-spacing-16">
      {/* Back Button */}
      <Pressable
        onPress={onBackPress}
        className="bg-surface-surfaceVariant h-10 w-10 items-center justify-center rounded-radius-full active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <Icon as={ArrowLeft} size={20} className="text-text-primary" />
      </Pressable>

      {/* Screen Title */}
      <Text className="text-heading-3 font-cairo font-bold text-text-primary">
        {isEditMode ? 'Edit Item' : 'Add Item'}
      </Text>

      {/* Header Save Button */}
      <Pressable
        onPress={onSubmitPress}
        disabled={!isFormValid || isLoading}
        className={`rounded-radius-full px-spacing-16 py-spacing-8 ${
          isFormValid && !isLoading ? 'bg-brand-primary' : 'bg-surface-surfaceVariant opacity-50'
        }`}
        accessibilityRole="button"
        accessibilityLabel="Save item">
        <Text
          className={`text-body font-cairo font-bold ${
            isFormValid && !isLoading ? 'text-brand-primary-container' : 'text-text-disabled'
          }`}>
          {isLoading ? 'Saving...' : 'Save'}
        </Text>
      </Pressable>
    </View>
  );
}
