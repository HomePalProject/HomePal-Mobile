import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
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
      {/* `directional` is the only flip. Wrapping this in a View that also applies
          scaleX(-1) composes the two transforms, cancelling them out in RTL and leaving
          the arrow pointing the LTR way. */}
      <Icon
        as={ArrowLeft}
        directional
        size={size}
        className={cn('text-text-primary', iconClassName)}
      />
    </Pressable>
  );
}
