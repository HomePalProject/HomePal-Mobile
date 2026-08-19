import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Lightbulb, ShoppingCart } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { useTranslation } from 'react-i18next';

interface AISuggestionCardProps {
  suggestion?: string;
  onAddToList?: () => void;
}

export function AISuggestionCard({ suggestion, onAddToList }: AISuggestionCardProps) {
  const { t } = useTranslation('pantry');
  const text =
    suggestion ??
    t(
      'aiAutoCategorizeDesc',
      "Type an item name and we'll automatically select the best category and unit for you."
    );
  const hasAction = Boolean(suggestion && onAddToList);

  return (
    <View className="bg-brand-secondary-container rounded-radius-large border border-brand-primary p-spacing-16">
      {/* Header row */}
      <View className="mb-spacing-8 flex-row items-center gap-spacing-8">
        <View className="bg-brand-secondary h-7 w-7 items-center justify-center rounded-radius-full">
          <Icon as={Lightbulb} size={24} className="text-brand-accent" />
        </View>
        <Text className="font-cairo text-lg font-bold text-brand-primary">
          {hasAction
            ? t('aiSuggestionTitle', 'AI Suggestion')
            : t('aiAutoCategorizeTitle', 'Auto-Categorize')}
        </Text>
      </View>

      {/* Suggestion Text */}
      <Text className="font-cairo text-base leading-5 text-text-primary">{text}</Text>

      {/* Add to List action (shown only in Edit mode with a real AI suggestion) */}
      {hasAction ? (
        <Pressable
          onPress={onAddToList}
          className="mt-spacing-12 gap-spacing-6 flex-row items-center self-start active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={t('addToList', 'Add to List')}>
          <Icon as={ShoppingCart} size={14} className="text-brand-secondary" />
          <Text className="text-brand-secondary font-cairo text-base font-bold">
            {t('addToList', 'Add to List')}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
