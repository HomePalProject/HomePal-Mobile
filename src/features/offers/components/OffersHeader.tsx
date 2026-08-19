import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Tag, Menu } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { SearchBar } from '@/src/components/ui/search-bar';
import { useTranslation } from 'react-i18next';
import { useDrawerStore } from '@/src/store/useDrawerStore';

interface OffersHeaderProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export const OffersHeader: React.FC<OffersHeaderProps> = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const { t } = useTranslation('offers');

  const handleSubmit = () => {
    onSearch(query);
  };

  const handleOpenDrawer = () => {
    useDrawerStore.getState().openDrawer();
  };

  return (
    <View className="px-4 py-6" style={{ gap: 20 }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {/* Hamburger Menu Drawer Trigger */}
          <Pressable
            onPress={handleOpenDrawer}
            className="rounded-full p-1.5 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="Open Navigation Drawer"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon as={Menu} size={24} className="text-brand-primary" />
          </Pressable>

          <Icon as={Tag} size={20} className="text-brand-primary" />
          <Text className="font-cairo text-[20px] font-bold text-brand-primary">
            {t('headerTitle')}
          </Text>
        </View>
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder={t('searchPlaceholder')}
        onSubmitEditing={handleSubmit}
        onClear={() => onSearch('')}
      />
    </View>
  );
};
