import React from 'react';
import { View, Text } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface PantryRecommendationCardProps {
  title?: string;
  description?: string;
}

export function PantryRecommendationCard({
  title = 'Smart Recommendation',
  description = 'You have Fresh Cilantro expiring soon. Consider making a quick salsa or garnish for your next meal.',
}: PantryRecommendationCardProps) {
  return (
    <View className="mx-spacing-16 mb-spacing-16 flex-row items-center gap-spacing-16 rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
      {/* Lightbulb Icon Circle Container */}
      <View className="h-12 w-12 items-center justify-center rounded-radius-full bg-brand-amber-300">
        <Icon as={Lightbulb} size={22} className="text-text-primary" />
      </View>

      {/* Text Column */}
      <View className="flex-1">
        <Text className="text-body mb-spacing-2 font-cairo font-bold text-text-primary">
          {title}
        </Text>
        <Text className="text-caption font-cairo leading-tight text-text-secondary">
          {description}
        </Text>
      </View>
    </View>
  );
}
