import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { BackButton } from '@/src/components/ui/back-button';

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
      <BackButton onPress={onBackPress} />

      {/* Screen Title */}
      <Text className="font-cairo text-xl font-bold text-text-primary">Item Detail</Text>

      {/* Edit (Pencil) Button */}
      <Pressable
        onPress={onEditPress}
        className="bg-surface-surfaceVariant h-10 w-10 items-center justify-center rounded-radius-full active:scale-90 active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="Edit item">
        <Icon as={Pencil} size={20} className="text-text-primary" />
      </Pressable>
    </View>
  );
}
