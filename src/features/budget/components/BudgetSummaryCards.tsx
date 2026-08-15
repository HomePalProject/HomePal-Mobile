import React from 'react';
import { View, Text } from 'react-native';
import { AnimatedPressable } from '@/src/components/ui/animated-pressable';

interface BudgetSummaryCardsProps {
  targetAmount: number;
  totalSpent: number;
  remainingAmount: number;
  onSetTargetPress: () => void;
  isLoading?: boolean;
}

/**
 * Format currency amount safely without localizing differences crashing React Native.
 */
const formatCurrency = (amount: number) => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const fixed = absAmount.toFixed(2);
  const [integer, decimal] = fixed.split('.');
  // Add thousands separators to integer part
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${isNegative ? '-' : ''}EGP ${formattedInteger}.${decimal}`;
};

export function BudgetSummaryCards({
  targetAmount,
  totalSpent,
  remainingAmount,
  onSetTargetPress,
  isLoading = false,
}: BudgetSummaryCardsProps) {
  return (
    <View className="gap-spacing-16 rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
      {/* Target & Spent Cards Row */}
      <View className="flex-row gap-spacing-16">
        {/* Budget Target Card */}
        <View className="bg-surface-surfaceVariant flex-1 flex-col justify-center rounded-radius-medium border border-surface-border p-spacing-16">
          <Text className="text-caption font-cairo font-semibold text-text-secondary">
            Budget Target
          </Text>
          <Text
            className="mt-spacing-8 w-full font-cairo text-xl font-bold text-brand-primary"
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            {formatCurrency(targetAmount)}
          </Text>
        </View>

        {/* Total Spent Card */}
        <View className="bg-surface-surfaceVariant flex-1 flex-col justify-center rounded-radius-medium border border-surface-border p-spacing-16">
          <Text className="text-caption font-cairo font-semibold text-text-secondary">
            Total Spent
          </Text>
          <Text
            className="mt-spacing-8 w-full font-cairo text-xl font-bold text-brand-accent"
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            {formatCurrency(totalSpent)}
          </Text>
        </View>
      </View>

      {/* Remaining Balance Card */}
      <View className="shadow-inner flex-row items-center justify-between rounded-radius-medium bg-brand-primary p-spacing-16">
        <View className="flex-1 pe-spacing-8">
          <Text className="text-caption font-cairo font-semibold text-text-inverse opacity-80">
            Remaining Balance
          </Text>
          <Text
            className={`mt-spacing-4 font-cairo text-[22px] font-bold ${
              remainingAmount < 0 ? 'text-brand-error' : 'text-text-inverse'
            }`}
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            {formatCurrency(remainingAmount)}
          </Text>
        </View>

        <AnimatedPressable
          onPress={onSetTargetPress}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Set Budget Target"
          pressScale={0.93}
          hapticStyle="medium"
          className="rounded-radius-full bg-brand-accent px-spacing-16 py-spacing-8 disabled:opacity-50">
          <Text className="font-cairo text-sm font-bold text-brand-primary">Set Target</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}
