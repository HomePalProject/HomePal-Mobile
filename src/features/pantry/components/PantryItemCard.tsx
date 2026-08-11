import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Check, AlertTriangle, Package } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { PantryItemResponse } from '@/src/types/api';
import { env } from '@/src/config/env';

interface PantryItemCardProps {
  item: PantryItemResponse;
  onPress?: (item: PantryItemResponse) => void;
}

const resolveImageUrl = (path?: string | null): string | null => {
  if (!path) return null;
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('file://') ||
    path.startsWith('data:')
  ) {
    return path;
  }
  const baseUrl = env.API_BASE_URL.endsWith('/') ? env.API_BASE_URL : `${env.API_BASE_URL}/`;
  const relativePath = path.startsWith('/') ? path.substring(1) : path;
  return `${baseUrl}${relativePath}`;
};

export function PantryItemCard({ item, onPress }: PantryItemCardProps) {
  const imageUrl = resolveImageUrl(item.categoryImagePath);
  const unitLabel = item.measuringUnitSymbol || item.measuringUnitName || '';

  // Determine freshness or low stock status
  const getStatusBadge = () => {
    if (item.quantity <= 1) {
      return {
        label: 'Low',
        isWarning: true,
      };
    }

    if (item.expireDate) {
      const expDate = new Date(item.expireDate);
      const now = new Date();
      const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 3) {
        return {
          label: 'Expiring soon',
          isWarning: true,
        };
      }
    }

    return {
      label: 'Fresh',
      isWarning: false,
    };
  };

  const status = getStatusBadge();

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      className="p-spacing-12 w-[48%] gap-spacing-8 rounded-radius-large border border-surface-border bg-surface-surface shadow-sm active:opacity-80">
      {/* Category / Product Image (Fixed height & rounded corners matching Figma 60px) */}
      <View className="bg-surface-surfaceVariant h-16 w-full items-center justify-center overflow-hidden rounded-radius-medium">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="h-full w-full rounded-radius-medium"
            resizeMode="cover"
          />
        ) : (
          <Icon as={Package} size={28} className="text-text-disabled" />
        )}
      </View>

      {/* Card Content (Title, Quantity, Badge) */}
      <View className="ml-2 flex-1 gap-spacing-4">
        {/* Item Name */}
        <Text numberOfLines={1} className="text-body font-cairo font-bold text-text-primary">
          {item.name}
        </Text>

        {/* Quantity & Unit */}
        <Text numberOfLines={1} className="text-caption font-cairo text-text-secondary">
          {item.quantity} {unitLabel} remaining
        </Text>

        {/* Status Badge */}
        <View className="mb-2 mt-spacing-4 flex-row items-center">
          {status.isWarning ? (
            <View className="py-spacing-2 flex-row items-center gap-spacing-4 self-start rounded-radius-full bg-status-error-container p-2 px-spacing-8">
              <Icon as={AlertTriangle} size={12} className="text-status-error" />
              <Text className="text-caption font-cairo font-bold text-status-error">
                {status.label}
              </Text>
            </View>
          ) : (
            <View className="py-spacing-2 flex-row items-center gap-spacing-4 self-start rounded-radius-full bg-brand-primary-container px-spacing-8">
              <Icon as={Check} size={12} className="text-brand-primary" />
              <Text className="text-caption font-cairo font-bold text-brand-primary">
                {status.label}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
