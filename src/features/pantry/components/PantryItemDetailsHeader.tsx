import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ArrowLeft, Pencil } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface PantryItemDetailsHeaderProps {
  onBackPress: () => void;
  onEditPress: () => void;
}

export function PantryItemDetailsHeader({
  onBackPress,
  onEditPress,
}: PantryItemDetailsHeaderProps) {
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
      <Text className="font-cairo text-xl font-bold text-text-primary">Item Detail</Text>

      {/* Edit (Pencil) Button */}
      <Pressable
        onPress={onEditPress}
        className="bg-surface-surfaceVariant h-10 w-10 items-center justify-center rounded-radius-full active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="Edit item">
        <Icon as={Pencil} size={20} className="text-text-primary" />
      </Pressable>
    </View>
  );
}
