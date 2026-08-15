import { Button } from '@/src/components/ui/button';
import { Icon } from '@/src/components/ui/icon';
import { ProTipCard } from '@/src/components/ui/pro-tip-card';
import { Text } from '@/src/components/ui/text';
import { Home, Mail, PlusCircle } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, View } from 'react-native';

export interface OrphanStateViewProps {
  onCreateHousehold: () => void;
  onViewInvitations: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function OrphanStateView({
  onCreateHousehold,
  onViewInvitations,
  onRefresh,
  isRefreshing = false,
}: OrphanStateViewProps) {
  const { t } = useTranslation('home');

  return (
    <ScrollView
      className="flex-1 bg-surface-background px-spacing-24"
      contentContainerStyle={{ paddingVertical: 32, gap: 32 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={['#356859']}
          tintColor="#356859"
          progressViewOffset={50}
        />
      }
      showsVerticalScrollIndicator={false}>
      <View className="items-start gap-spacing-8">
        <Text className="text-h2 font-cairo font-bold text-brand-primary">
          {t('orphan.welcome')}
        </Text>
        <View className="h-[4px] w-[56px] rounded-radius-full bg-brand-accent" />
      </View>

      <View className="items-center gap-spacing-24 py-spacing-16">
        <View className="border-brand-primary/10 bg-brand-primary-container/20 h-32 w-32 items-center justify-center rounded-radius-full border">
          <Icon as={Home} size={48} className="text-brand-primary" />
        </View>

        <View className="items-center gap-spacing-8 px-spacing-8">
          <Text className="text-bodyLarge text-center font-cairo font-bold text-text-primary">
            {t('orphan.noHousehold')}
          </Text>
          <Text className="text-bodySmall text-center font-cairo leading-[20px] text-text-secondary">
            {t('orphan.description')}
          </Text>
        </View>
      </View>

      <View className="w-full gap-spacing-16">
        <Button
          onPress={onCreateHousehold}
          className="h-14 w-full flex-row items-center justify-center gap-spacing-8 rounded-radius-full bg-brand-primary shadow-md active:bg-brand-primary-pressed">
          <Icon as={PlusCircle} size={20} className="text-text-inverse" />
          <Text className="text-body font-cairo font-bold text-text-inverse">
            {t('orphan.createBtn')}
          </Text>
        </Button>

        <Button
          onPress={onViewInvitations}
          variant="outline"
          className="h-14 w-full flex-row items-center justify-center gap-spacing-8 rounded-radius-full border-brand-primary/40 active:bg-brand-primary-container/10">
          <Icon as={Mail} size={20} className="text-brand-primary" />
          <Text className="text-body font-cairo font-bold text-brand-primary">
            {t('orphan.invitationsBtn')}
          </Text>
        </Button>
      </View>

      <ProTipCard description={t('orphan.proTip')} className="mt-spacing-8" />
    </ScrollView>
  );
}
