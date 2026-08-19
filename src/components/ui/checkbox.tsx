import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { Check } from 'lucide-react-native';
import { cn } from '@/src/utils';

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  children,
  className,
  error,
}) => {
  return (
    <View className="flex-col gap-1">
      <Pressable
        onPress={() => !disabled && onCheckedChange?.(!checked)}
        disabled={disabled}
        className={cn('flex-row items-center gap-3', disabled && 'opacity-50', className)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}>
        <View
          className={cn(
            'h-[20px] w-[20px] items-center justify-center rounded-[6px] border-[1.5px]',
            checked
              ? 'border-brand-primary bg-brand-primary'
              : 'border-surface-border bg-surface-surface',
            error && 'border-brand-error'
          )}>
          {checked ? <Icon as={Check} size={14} className="text-white" /> : null}
        </View>
        {children ? (
          <View className="flex-1">
            {typeof children === 'string' ? (
              <Text className="font-cairo text-[14px] leading-[20px] text-text-primary">
                {children}
              </Text>
            ) : (
              children
            )}
          </View>
        ) : null}
      </Pressable>
      {error ? (
        <Text className="font-cairo text-[12px] font-medium leading-[16px] text-brand-error">
          {error}
        </Text>
      ) : null}
    </View>
  );
};
