import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SubscriptionPlanResponse } from '@/src/types/api';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/src/components/ui/icon';
import { Check } from 'lucide-react-native';

interface PlanCardProps {
  plan: SubscriptionPlanResponse;
  onSubscribe: (planId: string) => void;
  isLoading?: boolean;
  isPopular?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onSubscribe, isLoading, isPopular }) => {
  const { t } = useTranslation();

  return (
    <View
      className={`relative mb-5 rounded-[24px] border-2 p-6 shadow-sm ${isPopular ? 'bg-surface-surfaceVariant border-brand-primary' : 'border-surface-border bg-surface-surface'}`}>
      {isPopular && (
        <View className="absolute -top-3 right-5 rounded-[16px] bg-brand-primary px-3 py-1 shadow-sm">
          <Text className="font-cairo text-[12px] font-bold tracking-wider text-text-inverse">
            {t('subscriptions.mostPopular', 'MOST POPULAR')}
          </Text>
        </View>
      )}

      <Text className="mb-1 font-cairo text-[18px] font-black text-brand-primary">{plan.name}</Text>
      <Text className="text-bodySmall mb-3 font-cairo leading-5 text-text-secondary">
        {plan.description ||
          t('subscriptions.subscriptionPlanDesc', 'Unlimited access to HomePal AI Assistant')}
      </Text>

      <View className="mb-4 flex-row items-baseline gap-1">
        <Text className="font-cairo text-[32px] font-black text-brand-primary">{plan.price}</Text>
        <Text className="text-bodyLarge font-cairo font-bold text-text-secondary">
          {plan.currency} / {plan.durationInDays} {t('subscriptions.days', 'Days')}
        </Text>
      </View>

      <View className="mb-6 gap-2">
        <View className="flex-row items-center gap-2">
          <Icon as={Check} size={16} className="text-brand-primary" />
          <Text className="text-bodySmall font-cairo text-text-primary">
            {t('subscriptions.subFeat1', 'Full Access to HomePal AI Chatbot')}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Icon as={Check} size={16} className="text-brand-primary" />
          <Text className="text-bodySmall font-cairo text-text-primary">
            {t('subscriptions.subFeat2', 'Smart 7-Day Meal Planning & Recipes')}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Icon as={Check} size={16} className="text-brand-primary" />
          <Text className="text-bodySmall font-cairo text-text-primary">
            {t('subscriptions.subFeat3', 'Automated Pantry Expiry Alerts')}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Icon as={Check} size={16} className="text-brand-primary" />
          <Text className="text-bodySmall font-cairo text-text-primary">
            {t('subscriptions.subFeat4', 'Offer-Optimized Grocery Lists')}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className={`mt-auto h-12 items-center justify-center rounded-[24px] ${isPopular ? 'bg-brand-primary' : 'border-2 border-brand-primary bg-transparent'}`}
        onPress={() => onSubscribe(plan.id)}
        disabled={isLoading}>
        <Text
          className={`font-cairo text-[16px] font-bold ${isPopular ? 'text-text-inverse' : 'text-brand-primary'}`}>
          {isLoading
            ? t('buttons.loading', 'Loading...')
            : t('subscriptions.subscribePaymob', 'Subscribe with Paymob')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
