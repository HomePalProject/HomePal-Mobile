import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Pressable, View, Modal } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Home, Package, UtensilsCrossed, Tag, Sparkles, Bot } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/hooks/useTheme';
import { useAppSelector, useAppDispatch } from '@/src/store';
import { fetchCurrentSubscription } from '@/src/store/slices/subscriptionSlice';
import { SubscriptionStatus } from '@/src/types/api';

export default function TabLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [subscriptionAlertVisible, setSubscriptionAlertVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentSubscription());
  }, [dispatch]);

  const currentSubscription = useAppSelector((state) => state.subscription.currentSubscription);
  const isFreePlan =
    !currentSubscription || currentSubscription.status !== SubscriptionStatus.Active;

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: 'shift',
          tabBarActiveTintColor: theme.colors.brand.primary,
          tabBarInactiveTintColor: theme.colors.text.secondary,
          tabBarLabelStyle: {
            fontFamily: 'Cairo_600SemiBold',
            fontSize: 12,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.surface.surface,
            borderTopColor: theme.colors.surface.border,
            height: 64 + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 10),
            paddingTop: 8,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('navigation.home'),
            tabBarIcon: ({ color, size }) => <Icon as={Home} size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="pantry"
          options={{
            title: t('navigation.pantry'),
            tabBarIcon: ({ color, size }) => <Icon as={Package} size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="agent-chat"
          options={{
            title: 'AI',
            tabBarLabel: () => null,
            tabBarButton: ({ ref, onPress, ...props }) => (
              <Pressable
                {...props}
                onPress={(e) => {
                  if (isFreePlan) {
                    setSubscriptionAlertVisible(true);
                  } else {
                    onPress?.(e);
                  }
                }}
                style={[
                  props.style,
                  {
                    top: -24,
                    height: 64,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: isFreePlan ? 0.6 : 1,
                  },
                ]}>
                <View
                  className={`h-14 w-14 items-center justify-center rounded-radius-full border-4 border-surface-surface shadow-md ${isFreePlan ? 'bg-surface-surfaceVariant' : 'bg-brand-accent'}`}>
                  <Bot size={24} color={isFreePlan ? theme.colors.text.disabled : '#ffffff'} />
                </View>
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: t('navigation.offers'),
            tabBarIcon: ({ color, size }) => <Icon as={Tag} size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="meals"
          options={{
            title: t('navigation.meals'),
            tabBarIcon: ({ color, size }) => (
              <Icon as={UtensilsCrossed} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
      </Tabs>

      {/* Subscription Alert Modal */}
      {subscriptionAlertVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={true}
          onRequestClose={() => setSubscriptionAlertVisible(false)}>
          <Pressable
            className="flex-1 items-center justify-center bg-black/50 px-6"
            onPress={() => setSubscriptionAlertVisible(false)}>
            <Pressable
              className="w-full max-w-[320px] rounded-2xl border border-surface-border bg-surface-surface p-6 shadow-xl"
              onPress={(e) => e.stopPropagation()}>
              <Text className="mb-2 text-center font-cairo text-[18px] font-bold text-text-primary">
                {t('subscriptions.subscriptionRequired', 'Subscription Required')}
              </Text>
              <Text className="mb-6 text-center font-cairo text-[14px] leading-[20px] text-text-secondary">
                {t(
                  'subscriptions.freePlanDesc',
                  'No active subscription found. Upgrade now to unlock full AI Chatbot capabilities.'
                )}
              </Text>
              <View style={{ gap: 12 }}>
                <Pressable
                  onPress={() => {
                    setSubscriptionAlertVisible(false);
                    router.push('/subscriptions');
                  }}
                  className="h-12 flex-row items-center justify-center rounded-xl bg-brand-primary">
                  <Text className="font-cairo text-[15px] font-bold text-white">
                    {t('subscriptions.title', 'View Plans')}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSubscriptionAlertVisible(false)}
                  className="h-12 flex-row items-center justify-center rounded-xl border border-surface-border">
                  <Text className="font-cairo text-[15px] font-bold text-text-secondary">
                    {t('buttons.cancel', 'Cancel')}
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
}
