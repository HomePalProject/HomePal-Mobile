import React from 'react';
import { Text, View } from 'react-native';
import { SvgIcon, SvgIconName } from '../../../components/ui/SvgIcon';

interface ImpactCardProps {
  value: string | number;
  label: string;
  bgColorClass: string;
  textColorClass: string;
  labelColorClass: string;
  iconName: SvgIconName;
  iconBgColorClass?: string;
  iconColor?: string;
}

export function ImpactCard({
  value,
  label,
  bgColorClass,
  textColorClass,
  labelColorClass,
  iconName,
  iconBgColorClass = 'bg-surface-surface/20',
  iconColor,
}: ImpactCardProps) {
  return (
    <View
      className={`min-h-[134px] w-[48%] justify-between rounded-radius-large p-spacing-16 ${bgColorClass} mb-spacing-16`}>
      <View
        className={`h-10 w-10 rounded-radius-full ${iconBgColorClass} items-center justify-center`}>
        <SvgIcon name={iconName} width={20} height={20} fill={iconColor} />
      </View>
      <View className="mt-spacing-8">
        <Text className={`text-h2 font-cairo font-bold ${textColorClass}`}>{value}</Text>
        <Text className={`text-caption font-cairo font-medium ${labelColorClass}`}>{label}</Text>
      </View>
    </View>
  );
}
