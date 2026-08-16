import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ShoppingCart, Plus } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { useTranslation } from 'react-i18next';

interface ShoppingListEmptyViewProps {
  onAddItem?: () => void;
}

export function ShoppingListEmptyView({ onAddItem }: ShoppingListEmptyViewProps) {
  const { t } = useTranslation('shopping');

  return (
    <View className="flex-1 items-center justify-center pt-spacing-32">
      <Text className="font-cairo text-sm font-bold text-text-primary">
        {t('emptyList')}
      </Text>
    </View>
  );
}
