import React from 'react';
import { View } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { cn } from '@/src/utils';
import { useTranslation } from 'react-i18next';

export interface ProTipCardProps {
  title?: string;
  description: string;
  className?: string;
}

export function ProTipCard({ title, description, className }: ProTipCardProps) {
  const { t } = useTranslation(['common']);
  const displayTitle = title || t('common:labels.proTip', 'Pro Tip');

  return (
    <View
      className={cn(
        'gap-spacing-12 flex-row items-start rounded-radius-large border border-brand-primary/20 p-spacing-16',
        className
      )}>
      <View className="rounded-radius-full p-spacing-8">
        <Icon as={Lightbulb} size={18} className="text-brand-accent" />
      </View>
      <View className="flex-1 gap-spacing-4">
        <Text className="text-bodySmall font-cairo font-bold text-text-primary">{displayTitle}</Text>
        <Text className="font-cairo text-sm leading-tight text-text-secondary">{description}</Text>
      </View>
    </View>
  );
}
