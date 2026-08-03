import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/src/components/ui/text';
import clsx from 'clsx';

export interface PreferenceChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function PreferenceChip({ label, selected, onPress, disabled }: PreferenceChipProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      className={clsx('m-1 rounded-radius-full border px-spacing-16 py-spacing-8', {
        'border-brand-primary bg-brand-primary': selected,
        'border-surface-border bg-transparent': !selected,
        'opacity-50': disabled,
      })}>
      <Text
        className={clsx('font-cairo text-sm font-semibold', {
          'text-text-inverse': selected,
          'text-text-primary': !selected,
        })}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
