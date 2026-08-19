import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { I18nManager } from 'react-native';
import { Icon } from '@/src/components/ui/icon';
import { cn } from '@/src/utils';

interface BackButtonProps extends PressableProps {
  onPress: () => void;
  className?: string;
  iconClassName?: string;
  size?: number;
}

export function BackButton({
  onPress,
  className,
  iconClassName,
  size = 26,
  ...props
}: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn('active:bg-surface-surfaceVariant rounded-full p-1.5', className)}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      {...props}>
      <Icon
        as={I18nManager.isRTL ? ArrowRight : ArrowLeft}
        size={size}
        className={cn('text-text-primary', iconClassName)}
      />
    </Pressable>
  );
}
