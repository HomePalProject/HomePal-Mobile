import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserSubscriptionResponse, SubscriptionStatus } from '@/src/types/api';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/src/components/ui/icon';
import { Star } from 'lucide-react-native';

interface CurrentSubscriptionCardProps {
  subscription: UserSubscriptionResponse | null;
}

export const CurrentSubscriptionCard: React.FC<CurrentSubscriptionCardProps> = ({
  subscription,
}) => {
  const { t } = useTranslation();

  const isFreePlan = !subscription || subscription.status !== SubscriptionStatus.Active;

  return (
    <View className="mb-5 rounded-radius-large border border-surface-border bg-surface-surface p-5 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between border-b border-surface-divider pb-3">
        <View className="flex-row items-center gap-spacing-8">
          <Icon as={Star} size={20} className="text-text-primary" />
          <Text className="text-bodyLarge font-cairo font-bold text-brand-primary">
            {t('subscriptions.currentPlanStatus', 'Current Plan Status')}
          </Text>
        </View>
        <View
          className={`rounded-radius-large px-2.5 py-1 ${isFreePlan ? 'bg-surface-surfaceVariant' : 'bg-brand-primaryContainer'}`}>
          <Text
            className={`text-labelSmall font-cairo font-bold ${isFreePlan ? 'text-text-secondary' : 'text-brand-primary'}`}>
            {isFreePlan
              ? t('subscriptions.freePlan', 'Free Plan')
              : t('subscriptions.activePlan', 'Active Plan')}
          </Text>
        </View>
      </View>

      <View className="bg-surface-surfaceVariant rounded-[12px] border border-surface-border p-4">
        {isFreePlan ? (
          <View>
            <Text className="text-bodyLarge mb-1 font-cairo font-bold text-brand-primary">
              {t('subscriptions.freePlan', 'Free Plan')}
            </Text>
            <Text className="text-bodySmall font-cairo text-text-secondary">
              {t(
                'subscriptions.freePlanDesc',
                'No active subscription found. Upgrade now to unlock full AI Chatbot capabilities.'
              )}
            </Text>
          </View>
        ) : (
          <View>
            <Text className="text-bodyLarge mb-1 font-cairo font-bold text-brand-primary">
              {subscription.planName || t('subscriptions.premiumPlan', 'Premium Plan')}
            </Text>
            <Text className="text-bodySmall font-cairo text-text-secondary">
              {t('subscriptions.validUntil', 'Valid until')}:{' '}
              {new Date(subscription.endDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
