import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image as ImageIcon, AlertTriangle, RefreshCw } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface PantryErrorViewProps {
  onRetry: () => void;
}

export function PantryErrorView({ onRetry }: PantryErrorViewProps) {
  return (
    <View className="flex-1 items-center justify-center px-spacing-24">
      <View className="bg-surface-surfaceVariant relative mb-spacing-24 h-28 w-28 items-center justify-center rounded-radius-full">
        <Icon as={ImageIcon} size={48} className="text-text-disabled" />
        <View className="absolute bottom-0 end-0 h-9 w-9 items-center justify-center rounded-radius-full border-2 border-surface-background bg-surface-surface shadow-sm">
          <Icon as={AlertTriangle} size={20} className="text-brand-error" />
        </View>
      </View>

      <Text className="text-h3 mb-spacing-8 text-center font-cairo font-bold text-text-primary">
        Something went wrong
      </Text>

      <Text className="text-body mb-spacing-32 px-spacing-16 text-center font-cairo text-text-secondary">
        We couldn't load your pantry items right now. Let's give it another stir.
      </Text>

      <Pressable
        onPress={onRetry}
        className="py-spacing-14 flex-row items-center gap-spacing-8 rounded-radius-full bg-brand-primary px-spacing-24 active:opacity-80">
        <Icon as={RefreshCw} size={18} className="text-text-inverse" />
        <Text className="text-body font-cairo font-bold text-text-inverse">Try again</Text>
      </Pressable>
    </View>
  );
}
