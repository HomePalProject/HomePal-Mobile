import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  Apple,
  Egg,
  Beef,
  Wheat,
  ShoppingBag,
  Cookie,
  Coffee,
  Home,
  Package,
  LucideIcon,
} from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { ProductCategoryResponse } from '@/src/types/api';

// ─── Category Icon Config ─────────────────────────────────────────────────────

export interface CategoryIconConfig {
  icon: LucideIcon;
  /** Static NativeWind bg token for the icon container */
  bg: string;
  /** Static NativeWind text-color token for the icon */
  color: string;
}

/**
 * Maps known category name keywords to a Lucide icon and static color tokens.
 */
export function getCategoryIconConfig(name: string): CategoryIconConfig {
  const lower = name.toLowerCase();

  if (
    lower.includes('produce') ||
    lower.includes('fruit') ||
    lower.includes('vegetable') ||
    lower.includes('fresh')
  ) {
    return { icon: Apple, bg: 'bg-brand-primary-container', color: 'text-brand-primary' };
  }
  if (
    lower.includes('dairy') ||
    lower.includes('egg') ||
    lower.includes('milk') ||
    lower.includes('cheese')
  ) {
    return { icon: Egg, bg: 'bg-status-error-container', color: 'text-status-error' };
  }
  if (
    lower.includes('meat') ||
    lower.includes('poultry') ||
    lower.includes('chicken') ||
    lower.includes('beef') ||
    lower.includes('fish')
  ) {
    return { icon: Beef, bg: 'bg-status-error-container', color: 'text-status-error' };
  }
  if (
    lower.includes('grain') ||
    lower.includes('pasta') ||
    lower.includes('bread') ||
    lower.includes('bakery') ||
    lower.includes('rice') ||
    lower.includes('noodle')
  ) {
    return { icon: Wheat, bg: 'bg-brand-secondary-container', color: 'text-brand-secondary' };
  }
  if (lower.includes('canned') || lower.includes('pantry') || lower.includes('essential')) {
    return { icon: ShoppingBag, bg: 'bg-surface-surfaceVariant', color: 'text-text-secondary' };
  }
  if (
    lower.includes('snack') ||
    lower.includes('nut') ||
    lower.includes('chip') ||
    lower.includes('cracker')
  ) {
    return { icon: Cookie, bg: 'bg-brand-secondary-container', color: 'text-brand-secondary' };
  }
  if (
    lower.includes('beverage') ||
    lower.includes('drink') ||
    lower.includes('juice') ||
    lower.includes('coffee') ||
    lower.includes('tea') ||
    lower.includes('water')
  ) {
    return { icon: Coffee, bg: 'bg-brand-primary-container', color: 'text-brand-primary' };
  }
  if (lower.includes('household') || lower.includes('clean') || lower.includes('laundry')) {
    return { icon: Home, bg: 'bg-surface-surfaceVariant', color: 'text-text-secondary' };
  }

  return { icon: Package, bg: 'bg-surface-surfaceVariant', color: 'text-text-secondary' };
}

// ─── Category Row Component ───────────────────────────────────────────────────

export interface CategoryRowProps {
  item: ProductCategoryResponse;
  isSelected: boolean;
  onPress: () => void;
}

export function CategoryRow({ item, isSelected, onPress }: CategoryRowProps) {
  const { icon, bg, color } = getCategoryIconConfig(item.name);

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-spacing-16 px-spacing-16 py-spacing-16 active:opacity-70"
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}>
      {/* Category Icon with soft tinted background */}
      <View className={`h-10 w-10 items-center justify-center rounded-radius-full ${bg}`}>
        <Icon as={icon} size={20} className={color} />
      </View>

      {/* Name + Optional Description */}
      <View className="flex-1">
        <Text className="text-body font-cairo font-bold text-text-primary">{item.name}</Text>
        {item.description ? (
          <Text numberOfLines={1} className="text-caption font-cairo text-text-secondary">
            {item.description}
          </Text>
        ) : null}
      </View>

      {/* Selection Indicator: solid circle (selected) vs empty border (unselected) */}
      {isSelected ? (
        <View className="h-6 w-6 rounded-radius-full bg-brand-primary" />
      ) : (
        <View className="h-6 w-6 rounded-radius-full border-2 border-surface-border" />
      )}
    </Pressable>
  );
}
