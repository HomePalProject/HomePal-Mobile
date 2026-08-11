import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Lightbulb, ShoppingCart } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface AISuggestionCardProps {
  suggestion?: string;
  onAddToList?: () => void;
}

const DEFAULT_SUGGESTION =
  "Type an item name and we'll automatically select the best category and unit for you.";

export function AISuggestionCard({ suggestion, onAddToList }: AISuggestionCardProps) {
  const text = suggestion ?? DEFAULT_SUGGESTION;
  const hasAction = Boolean(suggestion && onAddToList);

  return (
    <View className="border-brand-secondary bg-brand-secondary-container rounded-radius-large border p-spacing-16">
      {/* Header row */}
      <View className="mb-spacing-8 flex-row items-center gap-spacing-8">
        <View className="bg-brand-secondary h-7 w-7 items-center justify-center rounded-radius-full">
          <Icon as={Lightbulb} size={14} className="text-brand-onSecondary" />
        </View>
        <Text className="text-body text-brand-secondary font-cairo font-bold">
          {hasAction ? 'AI Suggestion' : 'Auto-Categorize'}
        </Text>
      </View>

      {/* Suggestion Text */}
      <Text className="text-caption font-cairo leading-5 text-text-primary">{text}</Text>

      {/* Add to List action (shown only in Edit mode with a real AI suggestion) */}
      {hasAction ? (
        <Pressable
          onPress={onAddToList}
          className="mt-spacing-12 gap-spacing-6 flex-row items-center self-start active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Add suggestion to shopping list">
          <Icon as={ShoppingCart} size={14} className="text-brand-secondary" />
          <Text className="text-caption text-brand-secondary font-cairo font-bold">
            Add to List
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
