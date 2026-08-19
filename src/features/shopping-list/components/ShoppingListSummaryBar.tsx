import React from 'react';
import { View, Text } from 'react-native';
import { ShoppingListItemResponse } from '@/src/types/api';
import { useTranslation } from 'react-i18next';

interface ShoppingListSummaryBarProps {
  items: ShoppingListItemResponse[];
}

export function ShoppingListSummaryBar({ items }: ShoppingListSummaryBarProps) {
  const { t } = useTranslation('shopping');
  const totalCount = items.length;
  const purchasedCount = items.filter((i) => i.isPurchased).length;

  let estTotal = 0;
  items.forEach((item) => {
    const itemTotal =
      item.totalPrice !== undefined && item.totalPrice !== null
        ? item.totalPrice
        : item.price
          ? item.price * (item.portionCount || 1)
          : 0;
    estTotal += itemTotal;
  });

  return (
    <View className="flex-row rounded-xl bg-surface-surface-variant px-spacing-8 py-spacing-16">
      {/* Total Items */}
      <View className="flex-1 items-center">
        <Text className="mb-1 font-cairo text-xs font-bold text-text-primary">{t('summary.totalItems')}</Text>
        <Text className="font-cairo text-lg font-black text-brand-primary">{totalCount}</Text>
      </View>

      {/* Divider */}
      <View className="bg-surface-border/30 w-px" />

      {/* Purchased */}
      <View className="flex-1 items-center">
        <Text className="mb-1 font-cairo text-xs font-bold text-text-primary">{t('summary.purchased')}</Text>
        <Text className="font-cairo text-lg font-black text-brand-accent">{purchasedCount}</Text>
      </View>

      {/* Divider */}
      <View className="bg-surface-border/30 w-px" />

      {/* Est. Total */}
      <View className="flex-1 items-center">
        <Text className="mb-1 font-cairo text-xs font-bold text-text-primary">{t('summary.estTotal')}</Text>
        <Text className="font-cairo text-lg font-black text-brand-primary">
          {estTotal.toFixed(2)} EGP
        </Text>
      </View>
    </View>
  );
}
