import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import PantryEmptyImage from '@/src/assets/images/pantry-empty.jpg';

interface PantryEmptyViewProps {
  onAddItem?: () => void;
}

export function PantryEmptyView({ onAddItem }: PantryEmptyViewProps) {
  return (
    <View className="flex-1 items-center justify-center px-spacing-24">
      <View className="bg-brand-accentContainer/30 mb-spacing-24 h-32 w-32 items-center justify-center rounded-radius-large">
        <Image
          source={PantryEmptyImage}
          resizeMode="contain"
          className="h-full w-full rounded-radius-large"
          accessibilityLabel="Empty Pantry"
        />
      </View>

      <Text className="text-h3 mb-spacing-8 text-center font-cairo font-bold text-text-primary">
        Your pantry is empty
      </Text>

      <Text className="text-body mb-spacing-32 px-spacing-16 text-center font-cairo text-text-secondary">
        Add your first item to start tracking freshness.
      </Text>

      <Pressable
        onPress={onAddItem}
        className="flex-row items-center gap-spacing-8 rounded-radius-full border border-surface-border bg-surface-surface px-spacing-24 py-spacing-16 shadow-sm active:opacity-80">
        <Icon as={Plus} size={18} className="text-text-primary" />
        <Text className="text-body text-text-medium font-cairo font-bold text-text-primary">
          Add item
        </Text>
      </Pressable>
    </View>
  );
}
