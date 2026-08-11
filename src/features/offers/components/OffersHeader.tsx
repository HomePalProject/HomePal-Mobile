import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Search, Tag } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { useColorScheme } from 'nativewind';
import { lightColors, darkColors } from '@/src/theme/colors';

interface OffersHeaderProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export const OffersHeader: React.FC<OffersHeaderProps> = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const placeholderColor = isDark ? darkColors.text.disabled : lightColors.text.disabled;

  const handleSubmit = () => {
    onSearch(query);
  };

  return (
    <View className="px-4 py-6" style={{ gap: 20 }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Icon as={Tag} size={20} className="text-brand-primary" />
          <Text className="font-cairo text-[20px] font-bold text-brand-primary">
            Supermarket Offers & Deals
          </Text>
        </View>
      </View>

      <View className="bg-surface-surfaceVariant h-14 flex-row items-center rounded-2xl px-4 py-1">
        <TextInput
          className="flex-1 font-cairo text-[16px] text-text-primary"
          placeholder="Search offers or products..."
          placeholderTextColor={placeholderColor}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
        />
        <TouchableOpacity
          onPress={handleSubmit}
          className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-surface-surface">
          <Icon as={Search} size={20} className="text-brand-primary" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
