import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useTranslation } from 'react-i18next';

export interface EmptyChatViewProps {
  onSuggestionPress: (suggestion: string) => void;
}

export function EmptyChatView({ onSuggestionPress }: EmptyChatViewProps) {
  const { theme } = useTheme();
  const { t } = useTranslation('agentChat');

  const suggestions = [
    t('empty.suggestions.buy', 'What should I buy this week?'),
    t('empty.suggestions.low', 'What items are running low?'),
    t('empty.suggestions.meals', 'Help me plan meals with what I have.'),
    t('empty.suggestions.offers', 'Best offers for my shopping list?'),
  ];

  return (
    <View className="flex-1 bg-surface-background">
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: 40,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Centered AI Robot Avatar Image */}
        <View
          style={{ width: 140, height: 140, borderRadius: 70 }}
          className="mb-spacing-24 items-center justify-center overflow-hidden border-4 border-brand-accent bg-brand-accent-container shadow-md">
          <Image
            source={require('@/src/assets/images/ai-avatar.png')}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
        </View>

        {/* Greeting Title */}
        <Text className="text-center font-cairo text-lg font-bold text-text-primary">
          {t('empty.greeting', "Hi! I'm your HomePal Assistant.")}
        </Text>

        {/* Greeting Subtitle */}
        <Text className="mt-spacing-8 text-center font-cairo text-base font-semibold text-text-secondary">
          {t('empty.question', 'How can I help you today?')}
        </Text>

        {/* Greeting Description */}
        <Text className="mt-spacing-16 px-spacing-16 text-center font-cairo text-sm text-text-secondary">
          {t(
            'empty.description',
            'I can help you plan meals, check your pantry, or find the best grocery offers.'
          )}
        </Text>

        {/* Suggested Section */}
        <View className="mt-spacing-32 w-full">
          <Text className="mb-spacing-8 px-spacing-4 font-cairo text-lg font-bold text-text-secondary">
            {t('empty.suggested', 'Suggested for you')}
          </Text>

          {suggestions.map((suggestion, index) => (
            <Pressable
              key={index}
              onPress={() => onSuggestionPress(suggestion)}
              accessibilityRole="button"
              accessibilityLabel={t('empty.suggestedAccessibility', {
                defaultValue: 'Suggested option: {{suggestion}}',
                suggestion,
              })}
              className="mb-spacing-8 flex-row items-center justify-between rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16 py-spacing-16 active:opacity-75">
              <Text className="flex-1 pe-spacing-8 font-cairo text-base font-medium text-text-primary">
                {suggestion}
              </Text>
              <ArrowUpRight size={16} color={theme.colors.brand.primary} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
