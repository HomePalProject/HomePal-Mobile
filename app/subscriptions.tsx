import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Alert,
  I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/src/components/ui/icon';
import { colors } from '@/src/theme';
import { useAppDispatch, useAppSelector } from '@/src/store';
import {
  fetchPlans,
  fetchCurrentSubscription,
  fetchPaymentHistory,
  checkoutPlan,
} from '@/src/store/slices/subscriptionSlice';
import { PlanCard } from '@/src/features/subscriptions/components/PlanCard';
import { CurrentSubscriptionCard } from '@/src/features/subscriptions/components/CurrentSubscriptionCard';
import { PaymentHistoryList } from '@/src/features/subscriptions/components/PaymentHistoryList';
import { LayoutGrid } from 'lucide-react-native';
import { SubscriptionStatus } from '@/src/types/api';

export default function SubscriptionsScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { plans, currentSubscription, paymentHistory, isLoading, isLoadingCheckout } =
    useAppSelector((state) => state.subscription);

  const isFreePlan =
    !currentSubscription || currentSubscription.status !== SubscriptionStatus.Active;

  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    await Promise.all([
      dispatch(fetchCurrentSubscription()),
      dispatch(fetchPlans()),
      dispatch(fetchPaymentHistory()),
    ]);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [dispatch])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSubscribe = async (planId: string) => {
    try {
      const result = await dispatch(checkoutPlan({ planId })).unwrap();
      if (result && result.iframeUrl) {
        // Navigate to Paymob checkout WebView
        router.push({
          pathname: '/paymob-checkout',
          params: { url: result.iframeUrl },
        });
      }
    } catch (error: any) {
      Alert.alert(
        t('errors.unexpectedError', 'Error'),
        error || t('subscriptions.paymentFailedDesc', 'There was an issue processing your payment.')
      );
    }
  };

  if (isLoading && !refreshing && !plans.length) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-surface-background"
      edges={['top', 'left', 'right', 'bottom']}>
      <View className="flex-row items-center justify-between border-b border-surface-border bg-surface-surface px-4 py-4">
        <Pressable onPress={() => router.back()} className="w-8 items-center p-1">
          <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
            <Icon as={ArrowLeft} size={24} className="text-brand-primary" />
          </View>
        </Pressable>
        <Text className="text-bodyLarge font-cairo font-bold text-brand-primary">
          {t('subscriptions.title', 'Subscription & Plans')}
        </Text>
        <View className="w-8 items-center p-1" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <CurrentSubscriptionCard subscription={currentSubscription} />

        {isFreePlan && (
          <>
            <View className="mb-4 mt-2 flex-row items-center gap-2">
              <Icon as={LayoutGrid} size={20} className="text-brand-primary" />
              <Text className="text-bodyLarge font-cairo font-bold text-brand-primary">
                {t('subscriptions.availablePlans', 'Available Subscription Plans')}
              </Text>
            </View>

            {plans.length === 0 ? (
              <View className="mb-6 items-center justify-center rounded-radius-large border border-surface-border bg-surface-surface p-6">
                <Text className="text-bodySmall text-center text-text-secondary">
                  {t(
                    'subscriptions.noPlansAvailable',
                    'No subscription plans are currently available.'
                  )}
                </Text>
              </View>
            ) : (
              plans.map((plan, index) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isPopular={index === 1} // just an example to highlight the second plan
                  onSubscribe={handleSubscribe}
                  isLoading={isLoadingCheckout}
                />
              ))
            )}
          </>
        )}

        <PaymentHistoryList history={paymentHistory} />

        {/* Payment Trust Badges */}
        <View className="bg-surface-surfaceVariant mt-2 rounded-radius-large border border-surface-border p-4">
          <View className="flex-row items-center gap-3">
            <Text className="text-titleLarge">🔒</Text>
            <View className="flex-1">
              <Text className="text-bodySmall font-cairo font-bold text-brand-primary">
                {t('subscriptions.paymobTrustTitle', 'Powered by Paymob Accept Gateway')}
              </Text>
              <Text className="text-labelSmall mt-1 text-text-secondary">
                {t(
                  'subscriptions.paymobTrustSub',
                  'Accepts Visa, MasterCard, Meeza, and Mobile Wallets'
                )}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
