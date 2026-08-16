import React from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { useColorScheme } from 'nativewind';
import { lightColors, darkColors } from '@/src/theme/colors';
import { cn } from '@/src/utils';

interface SearchBarProps extends Omit<TextInputProps, 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  containerClassName?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder,
  containerClassName,
  ...props
}: SearchBarProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? darkColors : lightColors;
  const placeholderColor = themeColors.text.disabled;

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View
      className={cn(
        'bg-surface-surfaceVariant h-12 flex-row items-center gap-spacing-8 rounded-radius-full border border-surface-border px-spacing-16 py-spacing-8',
        containerClassName
      )}>
      <Icon as={Search} size={18} className="text-text-secondary" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        cursorColor={themeColors.brand.primary}
        selectionColor={themeColors.brand.primaryContainer}
        className="text-body flex-1 p-0 font-cairo text-text-primary"
        returnKeyType="search"
        {...props}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} className="p-1 active:opacity-70">
          <Icon as={X} size={16} className="text-text-secondary" />
        </TouchableOpacity>
      )}
    </View>
  );
}
