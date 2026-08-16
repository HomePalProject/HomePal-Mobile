import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { ChevronLeft, ChevronRight, Wallet } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { AnimatedPressable } from '@/src/components/ui/animated-pressable';
import { useTranslation } from 'react-i18next';

interface MonthSelectorProps {
  currentDate: Date;
  onChangeDate: (date: Date) => void;
  isLoading?: boolean;
}

const MONTH_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const;

export function MonthSelector({
  currentDate,
  onChangeDate,
  isLoading = false,
}: MonthSelectorProps) {
  const { t } = useTranslation('budget');
  const formattedDate = `${t(`months.${MONTH_KEYS[currentDate.getMonth()]}`)} ${currentDate.getFullYear()}`;

  const handlePrevMonth = () => {
    if (isLoading) return;

    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onChangeDate(newDate);
  };

  const handleNextMonth = () => {
    if (isLoading) return;

    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onChangeDate(newDate);
  };

  return (
    <View className="flex-row items-center rounded-radius-large border border-surface-border bg-surface-surface px-spacing-8 py-spacing-8">
      {/* Budget Title */}
      <View className="flex-1 flex-row items-center gap-spacing-8">
        <Icon as={Wallet} size={18} className="text-brand-primary" />

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          className="text-body flex-1 font-cairo font-bold text-brand-primary">
          {t('monthlyHouseholdBudget', 'Monthly Household Budget')}
        </Text>
      </View>

      {/* Month Navigation */}
      <View className="flex-row items-center gap-spacing-4">
        <AnimatedPressable
          onPress={handlePrevMonth}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel={t('previousMonth', 'Previous Month')}
          pressScale={0.9}
          hapticStyle="light"
          className="items-center justify-center rounded-radius-full border border-surface-border bg-surface-surface p-spacing-8 disabled:opacity-50">
          <Icon as={ChevronLeft} directional size={16} className="text-text-primary" />
        </AnimatedPressable>

        <View className="items-center justify-center px-spacing-4">
          {isLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text numberOfLines={1} className="text-caption font-cairo font-bold text-text-primary">
              {formattedDate}
            </Text>
          )}
        </View>

        <AnimatedPressable
          onPress={handleNextMonth}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel={t('nextMonth', 'Next Month')}
          pressScale={0.9}
          hapticStyle="light"
          className="items-center justify-center rounded-radius-full border border-surface-border bg-surface-surface p-spacing-8 disabled:opacity-50">
          <Icon as={ChevronRight} directional size={16} className="text-text-primary" />
        </AnimatedPressable>
      </View>
    </View>
  );
}
