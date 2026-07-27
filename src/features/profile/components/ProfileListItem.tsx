import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SvgIcon, SvgIconName } from '../../../components/ui/SvgIcon';

interface ProfileListItemProps {
  title: string;
  iconName: SvgIconName;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showDivider?: boolean;
}

export function ProfileListItem({
  title,
  iconName,
  rightElement,
  onPress,
  showDivider = true,
}: ProfileListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between p-spacing-16 ${showDivider ? 'border-b border-surface-divider' : ''}`}>
      <View className="flex-row items-center gap-spacing-16">
        <View className="h-6 w-6 items-center justify-center">
          <SvgIcon name={iconName} width={20} height={20} />
        </View>
        <Text className="text-body font-cairo font-medium text-text-primary">{title}</Text>
      </View>
      {rightElement ? (
        rightElement
      ) : (
        <View className="h-3 w-[7.4px] items-center justify-center">
          <SvgIcon name="chevron-right-thin" width={7.4} height={12} fill="#6D6862" />
        </View>
      )}
    </Pressable>
  );
}
