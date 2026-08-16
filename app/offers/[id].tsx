import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';
import { OfferDetailsScreen } from '@/src/features/offers/screens/OfferDetailsScreen';
import { View, Text } from 'react-native';

export default function OfferDetailsRoute() {
  const { t } = useTranslation(['offers']);
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-background">
        <Text className="font-cairo text-status-error">
          {t('offers:offerIdMissing', 'Offer ID is missing')}
        </Text>
      </View>
    );
  }

  return <OfferDetailsScreen offerId={id} />;
}
