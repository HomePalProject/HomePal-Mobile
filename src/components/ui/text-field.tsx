import React, { useState } from 'react';
import { TextInput, View, TextInputProps, Pressable } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { Eye, EyeOff } from 'lucide-react-native';
import { cn } from '@/src/utils';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export const TextField = React.forwardRef<TextInput, TextFieldProps>(
  (
    {
      label,
      error,
      className,
      containerClassName,
      inputClassName,
      labelClassName,
      secureTextEntry,
      placeholderTextColor = '#A8A29B',
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isSecure = secureTextEntry && !isPasswordVisible;

    return (
      <View className={cn('w-full flex-col gap-1.5', containerClassName, className)}>
        {label ? (
          <Text
            className={cn(
              'font-cairo text-[13px] font-semibold leading-[18px] text-text-primary',
              error && 'text-brand-error',
              labelClassName
            )}>
            {label}
          </Text>
        ) : null}

        <View className="relative w-full flex-row items-center">
          <TextInput
            ref={ref}
            secureTextEntry={isSecure}
            placeholderTextColor={placeholderTextColor}
            className={cn(
              'h-[52px] w-full rounded-[8px] border border-surface-border bg-surface-surface px-[16px] font-cairo text-[16px] leading-[24px] text-text-primary focus:border-brand-primary',
              secureTextEntry && 'pr-[48px]',
              error && 'border-brand-error focus:border-brand-error',
              inputClassName
            )}
            {...props}
          />

          {secureTextEntry ? (
            <Pressable
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-0 h-[52px] w-[48px] items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}>
              <Icon
                as={isPasswordVisible ? EyeOff : Eye}
                size={20}
                className="text-text-secondary"
              />
            </Pressable>
          ) : null}
        </View>

        {error ? (
          <Text className="font-cairo text-[12px] font-medium leading-[16px] text-brand-error">
            {error}
          </Text>
        ) : null}
      </View>
    );
  }
);

TextField.displayName = 'TextField';
