import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown, LucideIcon } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface FormDropdownProps {
  label: string;
  value?: string;
  placeholder?: string;
  /** Generic fallback icon shown when no value is selected */
  leadingIcon?: LucideIcon;
  /** Dynamic icon shown when a value IS selected (overrides leadingIcon) */
  activeIcon?: LucideIcon;
  /** Class for the active icon color, e.g. 'text-brand-primary' */
  activeIconColor?: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export function FormDropdown({
  label,
  value,
  placeholder,
  leadingIcon,
  activeIcon,
  activeIconColor,
  onPress,
  accessibilityLabel,
}: FormDropdownProps) {
  const hasValue = Boolean(value);
  const iconToShow = hasValue && activeIcon ? activeIcon : leadingIcon;

  return (
    <View>
      {/* Field Label */}
      <Text className="text-caption mb-spacing-8 font-cairo font-bold text-text-secondary">
        {label}
      </Text>

      {/* Dropdown Trigger */}
      <Pressable
        onPress={onPress}
        className="h-14 flex-row items-center gap-spacing-8 rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16 active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}>
        {/* Leading / Active Icon */}
        {iconToShow ? (
          <Icon
            as={iconToShow}
            size={18}
            className={hasValue && activeIconColor ? activeIconColor : 'text-text-secondary'}
          />
        ) : null}

        {/* Value / Placeholder Text */}
        <Text
          className={`text-body flex-1 font-cairo ${hasValue ? 'text-text-primary' : 'text-text-secondary'}`}
          numberOfLines={1}>
          {hasValue ? value : (placeholder ?? `Select ${label.toLowerCase()}`)}
        </Text>

        {/* Trailing Chevron */}
        <Icon as={ChevronDown} size={18} className="text-text-secondary" />
      </Pressable>
    </View>
  );
}
