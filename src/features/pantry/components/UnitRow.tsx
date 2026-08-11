import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Package, GlassWater, Droplet, Grid, CheckCircle, LucideIcon } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { MeasuringUnitResponse } from '@/src/types/api';

// ─── Unit Icon Map ────────────────────────────────────────────────────────────

interface UnitSymbolConfig {
  icon?: LucideIcon;
  text?: string;
}

function getUnitSymbolConfig(name: string, symbolText?: string | null): UnitSymbolConfig {
  const lowerName = name.toLowerCase();
  const symbol = symbolText || name;

  if (lowerName.includes('pack')) {
    return { icon: Package };
  }
  if (lowerName.includes('jar')) {
    return { icon: GlassWater };
  }
  if (lowerName.includes('bottle')) {
    return { icon: Droplet };
  }
  if (lowerName.includes('item') || lowerName.includes('piece') || lowerName.includes('pcs')) {
    return { icon: Grid };
  }

  return { text: symbol.substring(0, 3) };
}

// ─── Unit Row — Selected ──────────────────────────────────────────────────────

interface UnitRowSelectedProps {
  symbol: string;
  name: string;
  onPress: () => void;
}

function UnitRowSelected({ symbol, name, onPress }: UnitRowSelectedProps) {
  const config = getUnitSymbolConfig(name, symbol);

  return (
    <Pressable
      onPress={onPress}
      className="mx-spacing-16 mb-spacing-24 flex-row items-center gap-spacing-16 rounded-radius-medium bg-brand-primary p-spacing-16 py-spacing-16 active:opacity-85"
      accessibilityRole="button"
      accessibilityState={{ selected: true }}>
      {/* Unit Symbol Badge */}
      <View className="h-10 w-10 shrink-0 items-center justify-center rounded-radius-full bg-brand-primary-container">
        {config.icon ? (
          <Icon as={config.icon} size={20} className="text-brand-primary" />
        ) : (
          <Text className="text-body font-cairo font-bold text-brand-primary">{config.text}</Text>
        )}
      </View>

      {/* Unit Name */}
      <Text className="text-body flex-1 font-cairo font-bold text-brand-primary-container">
        {name}
      </Text>

      {/* Selected Checkmark */}
      <Icon as={CheckCircle} size={20} className="text-brand-primary-container" />
    </Pressable>
  );
}

// ─── Unit Row — Unselected ────────────────────────────────────────────────────

interface UnitRowUnselectedProps {
  symbol: string;
  name: string;
  onPress: () => void;
}

function UnitRowUnselected({ symbol, name, onPress }: UnitRowUnselectedProps) {
  const config = getUnitSymbolConfig(name, symbol);

  return (
    <Pressable
      onPress={onPress}
      className="mx-spacing-16 mb-spacing-24 flex-row items-center gap-spacing-16 rounded-radius-medium bg-surface-background p-spacing-16 py-spacing-16 active:opacity-85"
      accessibilityRole="button"
      accessibilityState={{ selected: false }}>
      {/* Unit Symbol Badge — soft pink background matching category selector style */}
      <View className="h-10 w-10 shrink-0 items-center justify-center rounded-radius-full bg-status-error-container">
        {config.icon ? (
          <Icon as={config.icon} size={20} className="text-status-error" />
        ) : (
          <Text className="text-body font-cairo font-bold text-text-secondary">{config.text}</Text>
        )}
      </View>

      {/* Unit Name */}
      <Text numberOfLines={1} className="text-body flex-1 font-cairo text-text-primary">
        {name}
      </Text>
    </Pressable>
  );
}

// ─── Unified Row Component ────────────────────────────────────────────────────

interface UnitRowProps {
  item: MeasuringUnitResponse;
  isSelected: boolean;
  onPress: () => void;
}

export function UnitRow({ item, isSelected, onPress }: UnitRowProps) {
  const symbol = item.symbol ?? item.name;

  if (isSelected) {
    return <UnitRowSelected symbol={symbol} name={item.name} onPress={onPress} />;
  }

  return <UnitRowUnselected symbol={symbol} name={item.name} onPress={onPress} />;
}
