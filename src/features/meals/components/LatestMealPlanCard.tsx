import React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { Utensils, RefreshCw } from 'lucide-react-native';
import { MealPlanResponse } from '@/src/types/api';
import { useTranslation } from 'react-i18next';

interface LatestMealPlanCardProps {
  plan: MealPlanResponse | null;
  onRefresh: () => void;
  onViewDetails: (planId: string) => void;
  isLoading: boolean;
}

export function LatestMealPlanCard({
  plan,
  onRefresh,
  onViewDetails,
  isLoading,
}: LatestMealPlanCardProps) {
  const { t } = useTranslation('meals');

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const endDate = new Date(end).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${startDate} - ${endDate}`;
  };

  return (
    <View className="mb-6 rounded-2xl border border-surface-border bg-surface-background p-4 shadow-sm dark:border-text-secondary">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between px-1">
        <View className="flex-row items-center gap-2">
          <Icon as={Utensils} size={20} className="text-brand-primary" />
          <Text className="font-cairo text-lg font-bold text-brand-primary">{t('latestPlan')}</Text>
        </View>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            onRefresh();
          }}
          disabled={isLoading}
          className={`bg-brand-tertiary-container flex-row items-center gap-1 overflow-hidden rounded-full px-3 py-1.5 ${isLoading ? 'opacity-50' : ''}`}
          android_ripple={{ color: 'rgba(150, 150, 150, 0.2)' }}>
          <Icon as={RefreshCw} size={14} className="text-text-primary" />
          <Text className="font-cairo text-sm font-bold text-text-primary">{t('refresh')}</Text>
        </Pressable>
      </View>

      {/* Content */}
      <View>
        {plan ? (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              onViewDetails(plan.id);
            }}
            className="overflow-hidden rounded-xl border border-surface-border bg-surface-surface-variant p-5 shadow-sm dark:border-text-secondary"
            android_ripple={{ color: 'rgba(150, 150, 150, 0.2)' }}>
            <Text className="text-start font-cairo text-xl font-bold text-brand-primary">
              {plan.title}
            </Text>
            <Text className="mt-2 text-start font-cairo text-sm font-semibold text-text-secondary">
              {formatDateRange(plan.startDate, plan.endDate)}
            </Text>

            <View className="mt-5 flex-row items-end justify-between">
              <View>
                <Text className="font-cairo text-xs font-semibold text-text-secondary">
                  {t('estTotalCost')}
                </Text>
                <Text className="font-cairo text-lg font-bold text-brand-accent">
                  EGP {plan.totalEstimatedCost?.toFixed(2) || '0.00'}
                </Text>
              </View>
            </View>
          </Pressable>
        ) : (
          <View className="rounded-xl border border-surface-border bg-surface-surface-variant p-8">
            <Text className="text-center font-cairo text-base font-semibold text-text-secondary">
              {t('noActivePlan')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
