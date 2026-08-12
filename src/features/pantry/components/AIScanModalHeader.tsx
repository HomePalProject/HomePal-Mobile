import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X, Camera } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface AIScanModalHeaderProps {
  onClose: () => void;
}

export function AIScanModalHeader({ onClose }: AIScanModalHeaderProps) {
  return (
    <View className="mb-spacing-16 flex-row items-center justify-between border-b border-surface-border pb-spacing-16">
      <View className="flex-row items-center gap-spacing-8">
        <Icon as={Camera} size={22} className="text-brand-primary" />
        <Text className="text-heading-3 font-cairo font-bold text-text-primary">
          AI Camera Scan
        </Text>
      </View>
      <Pressable
        onPress={onClose}
        className="bg-surface-surfaceVariant h-8 w-8 items-center justify-center rounded-radius-full active:opacity-75"
        accessibilityRole="button"
        accessibilityLabel="Close scanner">
        <Icon as={X} size={18} className="text-text-secondary" />
      </Pressable>
    </View>
  );
}
