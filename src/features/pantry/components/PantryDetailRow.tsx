import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface PantryDetailRowProps {
  icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
  label: string;
  value: string;
  valueColorClass?: string;
}

export function PantryDetailRow({
  icon,
  iconColorClass,
  iconBgClass,
  label,
  value,
  valueColorClass = 'text-text-primary',
}: PantryDetailRowProps) {
  return (
    <View className="gap-spacing-12 flex-row items-center">
      <View className={`h-10 w-10 items-center justify-center rounded-radius-full ${iconBgClass}`}>
        <Icon as={icon} size={18} className={iconColorClass} />
      </View>
      <View className="flex-1">
        <Text className="text-caption font-cairo text-text-secondary">{label}</Text>
        <Text className={`text-body font-cairo font-bold ${valueColorClass}`}>{value}</Text>
      </View>
    </View>
  );
}
