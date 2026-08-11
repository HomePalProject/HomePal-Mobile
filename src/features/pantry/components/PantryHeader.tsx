import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { User, Store } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface PantryHeaderProps {
  onProfilePress?: () => void;
}

export function PantryHeader({ onProfilePress }: PantryHeaderProps) {
  return (
    <View className="h-16 flex-row items-center justify-between bg-surface-background px-spacing-16">
      <View className="flex-row items-center gap-spacing-8">
        <View className="h-10 w-10 items-center justify-center rounded-radius-full border border-brand-primary bg-brand-primary-container">
          <Icon as={Store} size={20} className="text-brand-primary" />
        </View>
        <Text className="text-h3 font-cairo font-bold text-text-primary">Pantry</Text>
      </View>

      <Pressable
        onPress={onProfilePress}
        className="h-10 w-10 items-center justify-center rounded-radius-full bg-brand-primary p-spacing-8 active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="Profile">
        <Icon as={User} size={20} className="text-text-inverse" />
      </Pressable>
    </View>
  );
}
