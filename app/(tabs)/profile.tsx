import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { Icon } from '@/src/components/ui/icon';
import {
  LogOut,
  MapPin,
  Users,
  Wallet,
  Heart,
  ShieldAlert,
  Mail,
  Calendar,
  User as UserIcon,
} from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { logoutUser } from '@/src/store/slices/authSlice';
import { AnimatedPressable } from '@/src/components/ui/animated-pressable';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user, onboardingData } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await dispatch(logoutUser());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const fullName = user?.fullName || 'HomePal User';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const lifestyles: string[] = onboardingData?.lifestyles ?? ['Not Declered Yet'];
  const allergies: string[] = onboardingData?.allergies ?? ['Not Declered Yet'];

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <Text className="mb-4 font-cairo text-[24px] font-bold text-text-primary">My Profile</Text>

        {/* User Card */}
        <View className="mb-6 flex-row items-center gap-4 rounded-[20px] border border-surface-border bg-surface-surface p-4 shadow-sm">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-primary">
            <Text className="font-cairo text-[22px] font-bold text-white">{initials}</Text>
          </View>
          <View className="flex-1 justify-center">
            <Text className="font-cairo text-[18px] font-bold leading-[24px] text-text-primary">
              {fullName}
            </Text>
            {user?.email && (
              <View className="mt-0.5 flex-row items-center gap-1.5">
                <Icon as={Mail} size={14} className="text-text-secondary" />
                <Text className="font-cairo text-[13px] text-text-secondary">{user.email}</Text>
              </View>
            )}
            {(user?.city || user?.governorate) && (
              <View className="mt-1 flex-row items-center gap-1.5">
                <Icon as={MapPin} size={14} className="text-brand-primary" />
                <Text className="font-cairo text-[13px] font-semibold text-brand-primary">
                  {[user?.city, user?.governorate].filter(Boolean).join(', ')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Section 1: Household Overview */}
        <View className="mb-6 flex-col gap-3">
          <Text className="font-cairo text-[16px] font-bold text-text-primary">
            Household Overview
          </Text>
          <View className="flex-row gap-3">
            {/* Members Card */}
            <View className="flex-1 flex-row items-center gap-3 rounded-[16px] border border-surface-border bg-surface-surface p-3.5">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-primary-container">
                <Icon as={Users} size={20} className="text-brand-primary" />
              </View>
              <View className="flex-1">
                <Text className="font-cairo text-[12px] text-text-secondary">Members</Text>
                <Text className="font-cairo text-[16px] font-bold text-text-primary">
                  {onboardingData?.memberCount ?? 'Not Declared Yet'}
                </Text>
              </View>
            </View>

            {/* Budget Card */}
            <View className="flex-1 flex-row items-center gap-3 rounded-[16px] border border-surface-border bg-surface-surface p-3.5">
              <View className="bg-brand-secondary-container h-10 w-10 items-center justify-center rounded-full">
                <Icon as={Wallet} size={20} className="text-brand-secondary" />
              </View>
              <View className="flex-1">
                <Text className="font-cairo text-[12px] text-text-secondary">Budget</Text>
                <Text
                  className="truncate font-cairo text-[14px] font-bold text-text-primary"
                  numberOfLines={1}>
                  {onboardingData?.monthlyBudget ?? 'Not Declered Yet'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 2: Dietary Preferences */}
        <View className="mb-6 flex-col gap-3">
          <View className="flex-row items-center gap-2">
            <Icon as={Heart} size={18} className="text-brand-primary" />
            <Text className="font-cairo text-[16px] font-bold text-text-primary">
              Dietary Lifestyles
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {lifestyles.map((item) => (
              <View
                key={item}
                className="border-brand-primary/30 bg-brand-primary-container/50 rounded-full border px-3.5 py-1.5">
                <Text className="font-cairo text-[13px] font-bold text-brand-primary">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section 3: Allergies */}
        {allergies.length > 0 && (
          <View className="mb-8 flex-col gap-3">
            <View className="flex-row items-center gap-2">
              <Icon as={ShieldAlert} size={18} className="text-status-error" />
              <Text className="font-cairo text-[16px] font-bold text-text-primary">
                Allergies & Avoidances
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {allergies.map((item) => (
                <View
                  key={item}
                  className="border-status-error/30 rounded-full border bg-brand-error-container px-3.5 py-1.5">
                  <Text className="font-cairo text-[13px] font-bold text-status-error">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Logout Button */}
        <Button
          onPress={handleLogout}
          variant="outline"
          hapticStyle="medium"
          className="border-status-error/40 bg-status-error/5 h-[52px] w-full flex-row items-center justify-center gap-2 rounded-full">
          <Icon as={LogOut} size={18} className="text-status-error" />
          <Text className="font-cairo text-[15px] font-bold text-status-error">
            Log Out of HomePal
          </Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
