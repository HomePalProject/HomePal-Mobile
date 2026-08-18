import React from 'react';
import { Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Home, Package, UtensilsCrossed, Tag, Sparkles, Bot } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/hooks/useTheme';

export default function TabLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('common');

  return (
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
          tabBarButton: ({ ref, ...props }) => (
            <Pressable
              {...props}
              style={[
                props.style,
                {
                  top: -24,
                  height: 64,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <View className="h-14 w-14 items-center justify-center rounded-radius-full border-4 border-surface-surface bg-brand-accent shadow-md">
                <Bot size={24} color="#ffffff" />
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
          tabBarIcon: ({ color, size }) => <Icon as={UtensilsCrossed} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
