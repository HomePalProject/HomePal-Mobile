import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Home, Package, UtensilsCrossed, ShoppingCart, User, Tag } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('common');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarActiveTintColor: isDark ? '#42826f' : '#356859',
        tabBarInactiveTintColor: isDark ? '#6d6862' : '#a8a29b',
        tabBarLabelStyle: {
          fontFamily: 'Cairo_600SemiBold',
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1d1c' : '#ffffff',
          borderTopColor: isDark ? '#363d3a' : '#e4e0da',
          height: 64 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="pantry"
        options={{
          title: t('navigation.pantry'),
          tabBarIcon: ({ color, size }) => <Icon as={Package} size={size} color={color} />,
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
        name="index"
        options={{
          title: t('navigation.home'),
          tabBarIcon: ({ color, size }) => <Icon as={Home} size={size} color={color} />,
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
        name="profile"
        options={{
          title: t('navigation.profile'),
          tabBarIcon: ({ color, size }) => <Icon as={User} size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
