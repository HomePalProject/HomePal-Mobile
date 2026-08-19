import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check, Square, Pencil, Trash2, Tag, X } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { ShoppingListItemResponse } from '@/src/types/api';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

interface ShoppingListItemCardProps {
  item: ShoppingListItemResponse;
  onToggle: (id: string) => void;
  onEdit: (item: ShoppingListItemResponse) => void;
  onDelete: (id: string) => void;
}

export function ShoppingListItemCard({
  item,
  onToggle,
  onEdit,
  onDelete,
}: ShoppingListItemCardProps) {
  const { t } = useTranslation('shopping');
  const unitStr = item.unitSymbol || item.unitName || '';
  const portionCount = item.portionCount || 1;
  const totalPrice =
    item.totalPrice !== undefined && item.totalPrice !== null
      ? item.totalPrice
      : item.price
        ? item.price * portionCount
        : null;

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(item.id);
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete(item.id);
  };

  return (
    <View
      className={`mb-spacing-16 rounded-xl border border-surface-border p-spacing-16 ${
        item.isPurchased ? 'bg-surface-surface-variant opacity-65' : 'bg-surface-surface-variant'
      }`}>
      {/* Top Row: Checkbox + Name + Actions */}
      <View className="flex-row items-start gap-spacing-8">
        {/* Checkbox */}
        <Pressable
          onPress={handleToggle}
          className="p-spacing-2 mt-1"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          {item.isPurchased ? (
            <View className="h-4 w-4 items-center justify-center rounded-sm bg-brand-primary">
              <Icon as={Check} size={12} className="text-white" />
            </View>
          ) : (
            <View className="h-4 w-4 rounded-sm border-[1.5px] border-text-secondary bg-white" />
          )}
        </Pressable>

        {/* Item Info */}
        <View className="flex-1">
          <Text
            numberOfLines={1}
            className={`font-cairo text-base font-black text-text-primary ${
              item.isPurchased ? 'line-through' : ''
            }`}>
            {item.name}
          </Text>

          {/* Badges Row */}
          <View className="mt-spacing-4 flex-row flex-wrap items-center gap-spacing-4">
            {/* Quantity Badge */}
            <View className="rounded-full bg-brand-primary-container px-3 py-1">
              <Text className="font-cairo text-[11px] font-bold text-brand-primary">
                {item.quantity} {unitStr}
              </Text>
            </View>

            {/* Portion Count Badge */}
            <View className="rounded-full bg-brand-primary px-3 py-1">
              <Text className="font-cairo text-[11px] font-bold text-white">
                x{portionCount} {portionCount === 1 ? t('item.portion') : t('item.portions')}
              </Text>
            </View>

            {/* Unit Price */}
            {item.price ? (
              <Text className="mt-1 w-full font-cairo text-xs font-bold text-brand-accent">
                {item.price} {t('item.egpPerUnit')}
              </Text>
            ) : null}

            {/* Total Price & Category */}
            <View className="mt-1 w-full flex-row items-center gap-2">
              {totalPrice ? (
                <Text className="font-cairo text-xs font-black text-brand-primary">
                  ({t('item.total')}: {totalPrice.toFixed(2)} EGP)
                </Text>
              ) : null}
              {item.categoryName ? (
                <Text className="font-cairo text-xs font-bold text-text-secondary">
                  {item.categoryName}
                </Text>
              ) : null}
            </View>

            {/* Deal Offer Chip */}
            {item.offerId ? (
              <View className="gap-spacing-2 py-spacing-2 flex-row items-center rounded-radius-full bg-brand-accent-container px-spacing-8">
                <Icon as={Tag} size={10} className="text-brand-accent" />
                <Text className="font-cairo text-xs font-bold text-brand-accent">{t('item.dealOffer')}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row items-center gap-2 pt-2">
          <Pressable
            onPress={() => onEdit(item)}
            className="h-8 w-8 items-center justify-center rounded-full border border-surface-border bg-white active:opacity-70"
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
            <Text className="font-cairo text-[10px] font-bold text-brand-primary">{t('item.edit')}</Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            className="h-8 w-8 items-center justify-center rounded-full bg-status-error active:opacity-70"
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
            <Icon as={X} size={14} className="text-white" />
          </Pressable>
        </View>
      </View>

      {/* Notes / Supermarket Row */}
      {(item.notes || item.supermarketName) && (
        <View className="mt-spacing-8 flex-row items-center justify-between border-t border-dashed border-surface-border pt-spacing-8">
          {item.notes ? (
            <Text
              numberOfLines={1}
              className="flex-1 font-cairo text-xs italic text-text-secondary">
              {item.notes}
            </Text>
          ) : (
            <View />
          )}
          {item.supermarketName ? (
            <Text className="font-cairo text-xs font-bold text-brand-primary">
              {item.supermarketName}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}
