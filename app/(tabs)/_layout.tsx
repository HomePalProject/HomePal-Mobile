import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { SvgIcon } from '../../src/components/ui/SvgIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FAF8F3',
          borderTopWidth: 0,
          height: 74,
          paddingBottom: 12,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#2D2A26',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        tabBarIconStyle: {
          width: 72,
          height: 32,
        },
        tabBarActiveTintColor: '#356859',
        tabBarInactiveTintColor: '#C8C5BF',
        tabBarLabelStyle: {
          fontFamily: 'Cairo',
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 64,
                height: 36,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? '#356859' : 'transparent',
              }}>
              <SvgIcon
                name="nav-home"
                width={22}
                height={22}
                stroke={focused ? '#FAF8F3' : (color as string)}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pantry"
        options={{
          title: 'Pantry',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 72,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? '#356859' : 'transparent',
              }}>
              <SvgIcon
                name="pantry"
                width={22}
                height={22}
                stroke={focused ? '#FAF8F3' : (color as string)}
                fill={focused ? '#FAF8F3' : (color as string)}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Meals',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 72,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? '#356859' : 'transparent',
              }}>
              <SvgIcon
                name="nav-meals"
                width={22}
                height={22}
                stroke={focused ? '#FAF8F3' : (color as string)}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 72,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? '#356859' : 'transparent',
              }}>
              <SvgIcon
                name="nav-meals"
                width={22}
                height={22}
                stroke={focused ? '#FAF8F3' : (color as string)}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
