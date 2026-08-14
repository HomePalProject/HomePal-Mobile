import React from 'react';
import { View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { X } from 'lucide-react-native';
import { MealPlanResponse } from '@/src/types/api';

interface MealPlanHistoryCardProps {
  plan: MealPlanResponse;
  onViewDetails: (planId: string) => void;
  onDelete: (planId: string) => void;
  canDelete?: boolean;
}

export function MealPlanHistoryCard({
  plan,
  onViewDetails,
  onDelete,
  canDelete = true,
}: MealPlanHistoryCardProps) {
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const endDate = new Date(end).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${startDate} - ${endDate}`;
  };

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onViewDetails(plan.id);
      }}
      className="relative mb-4 overflow-hidden rounded-xl border border-surface-border bg-surface-surface-variant p-5 shadow-sm dark:border-text-secondary"
      android_ripple={{ color: 'rgba(150, 150, 150, 0.2)' }}>
      <Text className="pr-10 text-left font-cairo text-lg font-bold text-text-primary">
        {plan.title}
      </Text>

      {canDelete && (
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            onDelete(plan.id);
          }}
          className="absolute right-3 top-3 overflow-hidden rounded-full bg-status-error p-1.5"
          android_ripple={{ color: 'rgba(255, 255, 255, 0.3)', borderless: true }}
          hitSlop={10}>
          <Icon as={X} size={16} className="text-white" />
        </Pressable>
      )}

      <View className="mt-2 flex-row flex-wrap items-center gap-2">
        <Text className="text-left font-cairo text-sm font-semibold text-text-secondary">
          {formatDateRange(plan.startDate, plan.endDate)}
        </Text>
        <Text className="font-cairo text-sm font-bold text-text-secondary">•</Text>
        <Text className="font-cairo text-sm font-bold text-brand-accent">
          EGP {plan.totalEstimatedCost?.toFixed(2) || '0.00'}
        </Text>
      </View>
    </Pressable>
  );
}
