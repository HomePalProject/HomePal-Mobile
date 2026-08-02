import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
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
        'border-brand-primary bg-transparent': !selected,
        'opacity-50': disabled,
      })}>
      <Text
        className={clsx('text-labelLarge font-cairo', {
          'text-text-inverse': selected,
          'text-brand-primary': !selected,
        })}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
