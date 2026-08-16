import React from 'react';
import { View } from 'react-native';
import { Archive, Users, Banknote, TrendingUp } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { HouseholdKpisDto } from '../../overview/types';

interface OverviewStatCardsProps {
  kpis?: HouseholdKpisDto;
}

const formatValue = (value: number | string | undefined) => {
  if (value === undefined || value === null) return '0';
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) return String(value);
  const fixed = num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
  const [integer, decimal] = fixed.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
};

export function OverviewStatCards({ kpis }: OverviewStatCardsProps) {
  const isBudgetNegative =
    kpis?.monthlyRemaining !== undefined &&
    (typeof kpis.monthlyRemaining === 'number'
      ? kpis.monthlyRemaining
      : parseFloat(kpis.monthlyRemaining)) < 0;

  return (
    <View className="flex-row flex-wrap justify-between gap-y-spacing-16">
      {/* Items in Inventory */}
      <View className="w-[48%] rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16">
        <View className="bg-surface-surfaceVariant h-10 w-10 items-center justify-center rounded-radius-medium p-spacing-8">
          <Icon as={Archive} size={20} className="text-text-primary" />
        </View>
        <Text className="text-caption mt-spacing-8 font-cairo font-semibold text-text-secondary">
          Items in Inventory
        </Text>
        <Text className="mt-spacing-4 font-cairo text-2xl font-bold text-brand-primary">
          {formatValue(kpis?.itemsInInventory)}
        </Text>
        <Text className="mt-spacing-4 font-cairo text-[11px] text-text-disabled">
          Inventory records
        </Text>
      </View>

      {/* Household Members */}
      <View className="w-[48%] rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16">
        <View className="bg-surface-surfaceVariant h-10 w-10 items-center justify-center rounded-radius-medium p-spacing-8">
          <Icon as={Users} size={20} className="text-text-primary" />
        </View>
        <Text className="text-caption mt-spacing-8 font-cairo font-semibold text-text-secondary">
          Household Members
        </Text>
        <Text className="mt-spacing-4 font-cairo text-2xl font-bold text-brand-primary">
          {formatValue(kpis?.householdMembers)}
        </Text>
        <Text className="mt-spacing-4 font-cairo text-[11px] text-text-disabled">
          Active members
        </Text>
      </View>

      {/* Monthly Budget */}
      <View className="w-[48%] rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16">
        <View className="bg-surface-surfaceVariant h-10 w-10 items-center justify-center rounded-radius-medium p-spacing-8">
          <Icon as={Banknote} size={20} className="text-text-primary" />
        </View>
        <Text className="text-caption mt-spacing-8 font-cairo font-semibold text-text-secondary">
          Monthly Budget
        </Text>
        <Text className="mt-spacing-4 font-cairo text-2xl font-bold text-brand-primary">
          {formatValue(kpis?.monthlyBudget)}
        </Text>
        <Text className="mt-spacing-4 font-cairo text-[11px] text-text-disabled">
          EGP per month
        </Text>
      </View>

      {/* Monthly Expenses */}
      <View className="w-[48%] rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16">
        <View className="bg-surface-surfaceVariant h-10 w-10 items-center justify-center rounded-radius-medium p-spacing-8">
          <Icon as={TrendingUp} size={20} className="text-text-primary" />
        </View>
        <Text className="text-caption mt-spacing-8 font-cairo font-semibold text-text-secondary">
          Monthly Expenses
        </Text>
        <Text
          className={[
            'mt-spacing-4 font-cairo text-2xl font-bold',
            isBudgetNegative ? 'text-brand-error' : 'text-brand-primary',
          ]
            .filter(Boolean)
            .join(' ')}>
          {formatValue(kpis?.monthlyExpenses)}
        </Text>
        <Text className="mt-spacing-4 font-cairo text-[11px] text-text-disabled">
          EGP per month
        </Text>
      </View>
    </View>
  );
}
