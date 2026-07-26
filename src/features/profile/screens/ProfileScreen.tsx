import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';
import Svg, { Circle, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { SvgIcon } from '../../../components/ui/SvgIcon';
import { ImpactCard } from '../components/ImpactCard';
import { ProfileListItem } from '../components/ProfileListItem';

const nouraAvatar = require('../../../assets/images/avatar-noura.png');

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const profileData = {
    name: 'Noura Hassan',
    email: 'noura@example.com',
    family: 'Hassan Family',
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <View className="h-16 flex-row items-center justify-between border-b border-surface-divider bg-surface-surface px-spacing-16 shadow-sm">
        <Text className="text-bodyLarge font-cairo font-bold text-brand-primary">
          Profile Overview
        </Text>
        <View className="flex-row items-center gap-spacing-8">
          <Pressable className="bg-surface-surfaceVariant h-10 w-10 items-center justify-center rounded-radius-full">
            <SvgIcon name="bell" width={20} height={20} fill="#356859" />
            <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-radius-full border border-surface-surface bg-brand-accent" />
          </Pressable>
          <View className="bg-brand-primaryContainer h-10 w-10 items-center justify-center overflow-hidden rounded-radius-full border border-brand-primary/20">
            <Image source={nouraAvatar} className="h-full w-full" />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Hero Section */}
        <View className="px-spacing-16 pb-spacing-24 pt-spacing-16">
          <View className="relative min-h-[300px] items-center justify-center overflow-hidden rounded-radius-large border border-surface-border/80 bg-surface-surface p-spacing-24 shadow-md">
            <View className="absolute -right-16 -top-16 h-48 w-48 opacity-80">
              <Svg width="100%" height="100%" viewBox="0 0 200 200">
                <Defs>
                  <RadialGradient
                    id="greenGlow"
                    cx="100"
                    cy="100"
                    r="100"
                    gradientUnits="userSpaceOnUse">
                    <Stop offset="0%" stopColor="#2A5347" stopOpacity="1" />
                    <Stop offset="60%" stopColor="#1B5042" stopOpacity="0.5" />
                    <Stop offset="100%" stopColor="#2A5347" stopOpacity="0" />
                  </RadialGradient>
                </Defs>
                <Circle cx="100" cy="100" r="100" fill="url(#greenGlow)" />
              </Svg>
            </View>
            <View className="absolute -bottom-16 -left-16 h-40 w-40 opacity-80">
              <Svg width="100%" height="100%" viewBox="0 0 200 200">
                <Defs>
                  <RadialGradient
                    id="yellowGlow"
                    cx="100"
                    cy="100"
                    r="100"
                    gradientUnits="userSpaceOnUse">
                    <Stop offset="0%" stopColor="#F3C35B" stopOpacity="1" />
                    <Stop offset="60%" stopColor="#F3C35B" stopOpacity="0.6" />
                    <Stop offset="100%" stopColor="#F3C35B" stopOpacity="0" />
                  </RadialGradient>
                </Defs>
                <Circle cx="100" cy="100" r="100" fill="url(#yellowGlow)" />
              </Svg>
            </View>

            <View className="relative mb-spacing-16 h-24 w-24 items-center justify-center">
              <View className="absolute inset-0">
                <Svg width="100%" height="100%" viewBox="0 0 96 96">
                  <Defs>
                    <LinearGradient id="avatarRing" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#1B5042" />
                      <Stop offset="100%" stopColor="#FDBA5A" />
                    </LinearGradient>
                  </Defs>
                  <Circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="url(#avatarRing)"
                    strokeWidth="4"
                    fill="none"
                  />
                </Svg>
              </View>
              <View className="h-[80px] w-[80px] overflow-hidden rounded-radius-full border-2 border-surface-surface bg-surface-surface">
                <Image source={nouraAvatar} className="h-full w-full" />
              </View>
              <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-radius-full border border-surface-border bg-brand-primary shadow">
                <SvgIcon name="edit-pencil" width={14} height={14} fill="#FAF8F3" />
              </View>
            </View>

            <Text className="text-h3 mb-spacing-4 font-cairo font-bold text-text-primary">
              {profileData.name}
            </Text>
            <Text className="text-bodySmall mb-spacing-12 font-cairo text-text-primary">
              {profileData.email}
            </Text>

            <View className="bg-surface-surfaceVariant py-spacing-6 mb-spacing-16 flex-row items-center gap-spacing-8 rounded-radius-full border border-surface-border px-spacing-16">
              <SvgIcon name="leaf" width={12} height={14} fill="#356859" />
              <Text className="text-label font-cairo font-semibold text-brand-primary">
                {profileData.family}
              </Text>
            </View>

            <Pressable
              className="py-spacing-10 w-50 h-12 justify-center rounded-radius-full bg-brand-accent-container px-spacing-24 shadow-sm active:bg-brand-accent-container/80"
              onPress={() => router.push('/edit-profile' as Href)}>
              <Text className="font-sm text-center font-cairo font-medium text-text-primary">
                Edit Profile
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="mb-spacing-32 px-spacing-16">
          <Text className="text-bodyLarge mb-spacing-16 pl-spacing-4 font-cairo font-bold text-text-primary">
            Your Impact
          </Text>
          <View className="gap-y-spacing-12 flex-row flex-wrap justify-between">
            <ImpactCard
              value="42"
              label="Pantry Items"
              bgColorClass="bg-brand-primary"
              textColorClass="text-text-inverse"
              labelColorClass="text-text-inverse/80"
              iconName="pantry"
              iconColor="#FFFFFF"
            />

            <ImpactCard
              value="12"
              label="Recipes Cooked"
              bgColorClass="bg-brand-amber-300"
              textColorClass="text-text-primary font-bold"
              labelColorClass="text-text-secondary"
              iconName="chef-hat"
              iconBgColorClass="bg-brand-accent"
              iconColor="#242523"
            />
            <ImpactCard
              value="450 EGP"
              label="Saved This Month"
              bgColorClass="bg-brand-primary-container"
              textColorClass="text-brand-primary font-bold"
              labelColorClass="text-brand-primary/80"
              iconName="wallet"
              iconColor="#356859"
            />
            <ImpactCard
              value="2.5kg"
              label="Waste Prevented"
              bgColorClass="bg-brand-primary-pressed"
              textColorClass="text-text-inverse font-bold"
              labelColorClass="text-text-inverse/80"
              iconName="waste"
              iconColor="#FFFFFF"
            />
          </View>
        </View>

        <View className="mb-spacing-24 px-spacing-16">
          <Text className="text-caption mb-spacing-8 pl-spacing-8 font-cairo font-bold uppercase tracking-widest text-text-secondary">
            Household
          </Text>
          <View className="overflow-hidden rounded-radius-large border border-surface-border bg-surface-surface shadow-sm">
            <ProfileListItem title="Household Members" iconName="household" />
            <ProfileListItem title="Grocery Budget" iconName="budget" />
            <ProfileListItem title="Dietary Preferences" iconName="diet" showDivider={false} />
          </View>
        </View>

        <View className="mb-spacing-24 px-spacing-16">
          <Text className="text-caption mb-spacing-8 pl-spacing-8 font-cairo font-bold uppercase tracking-widest text-text-secondary">
            Preferences
          </Text>
          <View className="overflow-hidden rounded-radius-large border border-surface-border bg-surface-surface shadow-sm">
            <ProfileListItem
              title="Notifications"
              iconName="bell"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#E4E0DA', true: '#356859' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <ProfileListItem
              title="Language"
              iconName="globe"
              rightElement={
                <Text className="text-bodySmall font-cairo font-bold text-brand-primary">
                  English (US)
                </Text>
              }
            />
            <ProfileListItem
              title="Dark Mode"
              iconName="moon"
              showDivider={false}
              rightElement={
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: '#E4E0DA', true: '#356859' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>

        <View className="mb-spacing-32 px-spacing-16">
          <Text className="text-caption mb-spacing-8 pl-spacing-8 font-cairo font-bold uppercase tracking-widest text-text-secondary">
            Support
          </Text>
          <View className="overflow-hidden rounded-radius-large border border-surface-border bg-surface-surface shadow-sm">
            <ProfileListItem
              title="Help Center"
              iconName="help"
              rightElement={
                <View className="h-5 w-5 items-center justify-center">
                  <SvgIcon name="arrow-right-settings" width={18} height={18} fill="#6D6862" />
                </View>
              }
            />
            <ProfileListItem title="Contact Support" iconName="contact" />
            <ProfileListItem title="Privacy Policy" iconName="privacy" showDivider={false} />
          </View>
        </View>

        <View className="gap-spacing-16 px-spacing-16">
          <Pressable
            className="items-center rounded-radius-full bg-brand-error p-spacing-16 shadow-sm active:bg-brand-error/90"
            onPress={() => console.log('Confirm logout modal')}>
            <Text className="text-body font-cairo font-bold text-text-inverse">Logout</Text>
          </Pressable>
          <Text className="text-caption text-center font-cairo text-text-secondary">
            HomePal Version 2.4.1 (Stable)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
