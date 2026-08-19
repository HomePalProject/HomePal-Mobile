import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { formatDisplayDate } from './ExpirationDatePickerModal';

interface ExpirationDateFieldProps {
  value: string; // YYYY-MM-DD
  onPress: () => void;
}

export function ExpirationDateField({ value, onPress }: ExpirationDateFieldProps) {
  return (
    <View>
      {/* Field Label */}
      <Text className="text-caption mb-spacing-8 font-cairo font-bold text-text-secondary">
        Expiration Date
      </Text>

      {/* Pressable Trigger Field */}
      <Pressable
        onPress={onPress}
        className="h-14 flex-row items-center gap-spacing-8 rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16 active:opacity-75"
        accessibilityRole="button"
        accessibilityLabel="Select expiration date">
        <Icon as={CalendarIcon} size={20} className="text-text-secondary" />
        <Text
          className={`text-body flex-1 font-cairo ${
            value ? 'text-text-primary' : 'text-text-secondary'
          }`}>
          {value ? formatDisplayDate(value) : 'Select expiration date'}
        </Text>
      </Pressable>

      <Text className="text-caption mt-spacing-4 font-cairo text-text-secondary">
        Optional. We'll remind you before it expires.
      </Text>
    </View>
  );
}
