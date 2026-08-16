import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Tag } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { SearchBar } from '@/src/components/ui/search-bar';
import { useTranslation } from 'react-i18next';

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

  return (
    <View className="px-4 py-6" style={{ gap: 20 }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
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
