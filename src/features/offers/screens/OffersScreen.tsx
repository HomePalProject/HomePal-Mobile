import React from 'react';
import { View, FlatList, ActivityIndicator, Switch, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/src/components/ui/text';
import { CheckCircle2 } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { useColorScheme } from 'nativewind';
import { lightColors, darkColors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useOffers } from '../hooks/useOffers';
import { useCategories } from '../hooks/useCategories';
import { useSupermarkets } from '../hooks/useSupermarkets';

import { OffersHeader } from '../components/OffersHeader';
import { FilterList } from '../components/FilterList';
import { OfferCard } from '../components/OfferCard';

export const OffersScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? darkColors : lightColors;
  const { t } = useTranslation('offers');

  const { categories } = useCategories();
  const { supermarkets } = useSupermarkets();

  const {
    offers,
    params,
    isLoading,
    isRefreshing,
    isLoadingMore,
    updateFilters,
    loadMore,
    refresh,
  } = useOffers({
    activeOnly: true, // Default to true as per design
  });

  const categoryOptions = categories.map((c) => ({ id: c.id, label: c.name }));
  const supermarketOptions = supermarkets.map((s) => ({ id: s.id, label: s.name }));

  const renderEmpty = () => {
    if (isLoading && !isRefreshing) {
      return (
        <View className="mt-10 items-center justify-center">
          <ActivityIndicator size="large" className="text-brand-primary" />
          <Text className="mt-4 font-cairo text-[16px] text-text-secondary">{t('loading')}</Text>
        </View>
      );
    }
    return (
      <View className="mt-10 items-center justify-center p-6">
        <Text className="text-center font-cairo text-[16px] text-text-secondary">
          {t('noActiveOffers')}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return <View className="h-20" />;
    return (
      <View className="items-center py-6">
        <ActivityIndicator size="small" className="text-brand-primary" />
      </View>
    );
  };

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => (
      <OfferCard offer={item} onPress={() => router.push(`/offers/${item.id}`)} />
    ),
    [router]
  );

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['top']}>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="pb-4">
            <OffersHeader
              initialQuery={params.query}
              onSearch={(query) => updateFilters({ query })}
            />

            <FilterList
              title={t('categories')}
              type="category"
              options={categoryOptions}
              selectedId={params.categoryId}
              onSelect={(id) => updateFilters({ categoryId: id || undefined })}
            />

            <FilterList
              title={t('supermarkets')}
              type="supermarket"
              options={supermarketOptions}
              selectedId={params.supermarketId}
              onSelect={(id) => updateFilters({ supermarketId: id || undefined })}
            />

            <View className="bg-surface-surfaceVariant mx-4 my-2 flex-row items-center justify-between rounded-xl border border-surface-border px-4 py-3">
              <View className="flex-row items-center gap-2">
                <Icon
                  as={CheckCircle2}
                  size={20}
                  className={params.activeOnly ? 'text-brand-primary' : 'text-text-disabled'}
                />
                <Text className="font-cairo text-[15px] font-bold text-text-primary">
                  {t('activeDealsOnly')}
                </Text>
              </View>
              <Switch
                value={params.activeOnly}
                onValueChange={(val) => updateFilters({ activeOnly: val })}
                trackColor={{
                  false: themeColors.surface.border,
                  true: themeColors.brand.primaryContainer,
                }}
                thumbColor={
                  params.activeOnly ? themeColors.brand.primary : themeColors.surface.surface
                }
              />
            </View>
          </View>
        }
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            colors={[themeColors.brand.primary]}
            tintColor={themeColors.brand.primary}
          />
        }
      />
    </SafeAreaView>
  );
};
