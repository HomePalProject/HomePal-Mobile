import React, { useRef } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import * as Haptics from 'expo-haptics';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onChange, min = 0, max = 9999 }: QuantityStepperProps) {
  const inputRef = useRef<TextInput>(null);

  const handleDecrement = () => {
    const next = Math.max(min, value - 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(next);
  };

  const handleIncrement = () => {
    const next = Math.min(max, value + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(next);
  };

  const handleTextChange = (text: string) => {
    const parsed = parseInt(text, 10);
    if (text === '' || isNaN(parsed)) {
      onChange(min);
    } else {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  const isDecrementDisabled = value <= min;
  const isIncrementDisabled = value >= max;

  return (
    <View className="h-14 flex-row items-center overflow-hidden rounded-radius-medium border border-surface-border bg-surface-surface">
      {/* Decrement Button */}
      <Pressable
        onPress={handleDecrement}
        disabled={isDecrementDisabled}
        className="h-full items-center justify-center bg-surface-surface-variant px-spacing-16 active:scale-95 active:opacity-60"
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity">
        <Icon
          as={Minus}
          size={18}
          className={isDecrementDisabled ? 'text-text-disabled' : 'text-text-primary'}
        />
      </Pressable>

      {/* Divider */}
      <View className="h-full w-px bg-surface-border" />

      {/* Center: Number Input */}
      <View className="flex-1 flex-row items-center justify-center gap-spacing-8 px-spacing-8">
        <TextInput
          ref={inputRef}
          value={String(value)}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          returnKeyType="done"
          textAlign="center"
          className="text-body min-w-[40px] font-cairo font-bold text-text-primary"
          accessibilityLabel="Quantity"
        />
      </View>

      {/* Divider */}
      <View className="h-full w-px bg-surface-border" />

      {/* Increment Button */}
      <Pressable
        onPress={handleIncrement}
        disabled={isIncrementDisabled}
        className="h-full items-center justify-center bg-surface-surface-variant px-spacing-16 active:scale-95 active:opacity-60"
        accessibilityRole="button"
        accessibilityLabel="Increase quantity">
        <Icon
          as={Plus}
          size={18}
          className={isIncrementDisabled ? 'text-text-disabled' : 'text-text-primary'}
        />
      </Pressable>
    </View>
  );
}
