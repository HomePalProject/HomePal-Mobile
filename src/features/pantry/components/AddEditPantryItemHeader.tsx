import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BackButton } from '@/src/components/ui/back-button';

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
    <View className="flex-row items-center justify-between border-b border-surface-border bg-surface-surface px-spacing-16 py-spacing-8">
      {/* Back Button */}
      <BackButton onPress={onBackPress} />

      {/* Screen Title */}
      <Text className="font-cairo text-xl font-bold text-text-primary">
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
          className={`font-cairo text-base font-bold text-brand-primary-container ${
            isFormValid && !isLoading ? 'text-brand-primary-container' : 'text-text-disabled'
          }`}>
          {isLoading ? 'Saving...' : 'Save'}
        </Text>
      </Pressable>
    </View>
  );
}
