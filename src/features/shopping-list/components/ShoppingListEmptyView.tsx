import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ShoppingCart, Plus } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface ShoppingListEmptyViewProps {
  onAddItem?: () => void;
}

export function ShoppingListEmptyView({ onAddItem }: ShoppingListEmptyViewProps) {
  return (
    <View className="flex-1 items-center justify-center pt-spacing-32">
      <Text className="font-cairo text-sm font-bold text-text-primary">
        Your shopping list is empty.
      </Text>
    </View>
  );
}
