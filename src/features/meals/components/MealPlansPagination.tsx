import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Pressable } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface MealPlansPaginationProps {
  pageNumber: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
}

export function MealPlansPagination({
  pageNumber,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  isLoading,
}: MealPlansPaginationProps) {
  const { t } = useTranslation(['common']);
  return (
    <View className="flex-row items-center justify-between border-t border-surface-surface-variant pt-4">
      <Text className="font-cairo text-sm font-semibold text-text-primary">
        Page {pageNumber} of {totalPages || 1}
      </Text>

      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            onPageChange(pageNumber - 1);
          }}
          disabled={!hasPreviousPage || isLoading}
          className={`border-surface-outline flex-row items-center gap-1 overflow-hidden rounded-full border px-3 py-1.5 ${!hasPreviousPage || isLoading ? 'opacity-50' : ''}`}
          android_ripple={{ color: 'rgba(150, 150, 150, 0.2)' }}>
          <Icon as={ChevronLeft} directional size={16} className="text-text-primary" />
          <Text className="font-cairo text-sm font-semibold text-text-primary">
            {t('common:buttons.previous', 'Previous')}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            onPageChange(pageNumber + 1);
          }}
          disabled={!hasNextPage || isLoading}
          className={`border-surface-outline flex-row items-center gap-1 overflow-hidden rounded-full border px-3 py-1.5 ${!hasNextPage || isLoading ? 'opacity-50' : ''}`}
          android_ripple={{ color: 'rgba(150, 150, 150, 0.2)' }}>
          <Text className="font-cairo text-sm font-semibold text-text-primary">
            {t('common:buttons.next', 'Next')}
          </Text>
          <Icon as={ChevronRight} directional size={16} className="text-text-primary" />
        </Pressable>
      </View>
    </View>
  );
}
