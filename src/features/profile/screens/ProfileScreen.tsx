import React, { useState, useEffect, useRef } from 'react';
import { useDrawerStore } from '@/src/store/useDrawerStore';
import { View, Text, ScrollView, Pressable, Image, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Href, useFocusEffect } from 'expo-router';
import Svg, { Circle, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import * as Clipboard from 'expo-clipboard';
import { SvgIcon } from '../../../components/ui/SvgIcon';
import { ProfileListItem } from '../components/ProfileListItem';
import { Menu, ChevronDown, Check, LogOut, Calendar, Copy, Sparkles } from 'lucide-react-native';
import { Icon } from '../../../components/ui/icon';
import { useToast } from '@/src/providers/ToastProvider';
import { useAppSelector, useAppDispatch } from '../../../store';
import { logoutUser } from '../../../store/slices/authSlice';
import { fetchCurrentSubscription } from '../../../store/slices/subscriptionSlice';
import { SubscriptionStatus } from '@/src/types/api';
import { useTheme, ThemeMode } from '../../../providers/ThemeProvider';
import { useLanguage } from '@/src/localization';
import { LanguageSelectionModal } from '@/src/components/common/LanguageSelectionModal';
import { useTranslation } from 'react-i18next';
import { AppBottomSheet } from '@/src/components/ui/bottom-sheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
export default function ProfileScreen() {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const themeBottomSheetRef = useRef<BottomSheetModal>(null);
  const languageBottomSheetRef = useRef<BottomSheetModal>(null);
  const dispatch = useAppDispatch();
  const { mode, setMode } = useTheme();
  const { currentLanguage } = useLanguage();
  const insets = useSafeAreaInsets();

  const { fullName, email, profileImageUri, birthDate } = useAppSelector((state) => state.profile);
  const { currentSubscription } = useAppSelector((state) => state.subscription);
  const { showToast } = useToast();

  const { t } = useTranslation(['profile', 'common']);
  const handleCopyEmail = async () => {
    if (email) {
      await Clipboard.setStringAsync(email);
      showToast({
        title: t('common:errors.copied', 'Copied!'),
        message: t('common:errors.emailCopied', 'Email address copied to clipboard.'),
        type: 'success',
      });
    }
  };

  // Profile is fetched by authSlice during app bootstrap
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchCurrentSubscription());
    }, [dispatch])
  );

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const name = fullName;

  const handleOpenDrawer = useDrawerStore((state) => state.openDrawer);

  const renderThemeOption = (optionMode: ThemeMode, label: string) => {
    const isSelected = mode === optionMode;
    return (
      <Pressable
        key={optionMode}
        onPress={() => {
          setMode(optionMode);
          themeBottomSheetRef.current?.dismiss();
        }}
        className="flex-row items-center justify-between border-b border-surface-border py-4">
        <Text
          className={`font-cairo text-base ${isSelected ? 'font-bold' : ''} text-text-primary ${isSelected ? 'text-brand-primary' : ''}`}>
          {label}
        </Text>
        {isSelected && <Icon as={Check} size={20} className="text-brand-primary" />}
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['left', 'right']}>
      <View
        className="flex-row items-center justify-between border-b border-surface-divider bg-surface-surface px-spacing-16 pb-3 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) + 12 }}>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={handleOpenDrawer}
            className="rounded-full p-1.5 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="Open Drawer Menu">
            <Icon as={Menu} size={24} className="text-brand-primary" />
          </Pressable>
          <Text className="text-bodyLarge font-cairo font-bold text-brand-primary">
            {t('profile:overview')}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="px-spacing-16 pb-spacing-24 pt-spacing-16">
          <View className="relative min-h-[300px] items-center justify-center overflow-hidden rounded-radius-large border border-surface-border/80 bg-surface-surface p-spacing-24 shadow-md">
            <View className="absolute -end-16 -top-16 h-48 w-48 opacity-80">
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
            <View className="absolute -bottom-16 -start-16 h-40 w-40 opacity-80">
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
              <View className="h-[80px] w-[80px] items-center justify-center overflow-hidden rounded-radius-full border-2 border-surface-surface bg-brand-primary-container">
                {profileImageUri ? (
                  <Image source={{ uri: profileImageUri }} className="h-full w-full" />
                ) : (
                  <Text className="text-body font-cairo text-2xl font-bold text-brand-primary">
                    {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                  </Text>
                )}
              </View>
              <View className="absolute bottom-0 end-0 h-8 w-8 items-center justify-center rounded-radius-full border border-surface-border bg-brand-primary shadow">
                <Pressable onPress={() => router.push('/edit-profile' as Href)}>
                  <SvgIcon name="edit-pencil" width={14} height={14} fill="#FAF8F3" />
                </Pressable>
              </View>
            </View>

            <Text className="text-h3 mb-spacing-4 font-cairo font-bold text-text-primary">
              {name}
            </Text>

            <Pressable
              onPress={handleCopyEmail}
              className="mb-spacing-8 flex-row items-center gap-1 active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="Copy email address">
              <Text className="text-bodySmall font-cairo text-text-primary">{email}</Text>
              <Icon as={Copy} size={14} className="text-text-secondary" />
            </Pressable>

            {birthDate && (
              <View className="bg-surface-surfaceVariant py-spacing-6 mb-spacing-16 flex-row items-center gap-spacing-8 rounded-radius-full border border-surface-border px-spacing-16">
                <Icon as={Calendar} size={14} className="text-brand-primary" />
                <Text className="text-label font-cairo font-semibold text-text-primary">
                  {birthDate}
                </Text>
              </View>
            )}

            <Pressable
              className="py-spacing-10 w-50 h-12 justify-center rounded-radius-full bg-brand-accent-container px-spacing-24 shadow-sm active:bg-brand-accent-container/80"
              onPress={() => router.push('/edit-profile' as Href)}>
              <Text className="font-sm text-center font-cairo font-medium text-text-primary">
                {t('profile:editProfile')}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* <View className="mb-spacing-32 px-spacing-16"> */}
        {/* <Text className="text-bodyLarge mb-spacing-16 ps-spacing-4 font-cairo font-bold text-text-primary">
            Your Impact
          </Text> */}
        {/* <View className="flex-row flex-wrap justify-between gap-y-spacing-16">
            <ImpactCard
              value="42"
              label="Pantry Items"
              bgColorClass="bg-brand-primary"
              textColorClass="text-white"
              labelColorClass="text-white/80"
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
              textColorClass="text-white font-bold"
              labelColorClass="text-white/80"
              iconName="waste"
              iconColor="#FFFFFF"
            />
          </View> */}
        {/* </View> */}

        {/* <View className="mb-spacing-24 px-spacing-16">
          <Text className="text-caption mb-spacing-8 pl-spacing-8 font-cairo font-bold uppercase tracking-widest text-text-secondary">
            Household
          </Text>
          <View className="overflow-hidden rounded-radius-large border border-surface-border bg-surface-surface shadow-sm">
            <ProfileListItem title="Household Members" iconName="household" />
            <ProfileListItem title="Grocery Budget" iconName="budget" />
            <ProfileListItem title="Dietary Preferences" iconName="diet" showDivider={false} />
          </View>
        </View> */}

        <View className="mb-spacing-24 px-spacing-16">
          <Text className="text-caption mb-spacing-8 pl-spacing-8 font-cairo font-bold uppercase tracking-widest text-text-secondary">
            {t('navigation.subscription', 'Subscription')}
          </Text>
          {currentSubscription?.status === SubscriptionStatus.Active ? (
            <View className="overflow-hidden rounded-[12px] border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
              <Text className="text-bodyLarge mb-1 font-cairo font-bold text-brand-primary">
                {currentSubscription.planName || t('premiumPlan', 'Premium Plan')}
              </Text>
              <Text className="text-bodySmall font-cairo text-text-secondary">
                {t('validUntil', 'Valid until')}:{' '}
                {new Date(currentSubscription.endDate).toLocaleDateString()}
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={() => router.push('/subscriptions' as Href)}
              className="active:bg-surface-surfaceVariant flex-row items-center justify-between overflow-hidden rounded-radius-large border border-surface-border bg-surface-surface px-spacing-16 py-spacing-16 shadow-sm">
              <Text className="text-body font-cairo font-medium text-text-primary">
                {t('navigation.subscription', 'Subscription & Plans')}
              </Text>
              <Icon as={ChevronDown} size={16} className="text-brand-primary" />
            </Pressable>
          )}
        </View>

        <View className="mb-spacing-24 px-spacing-16">
          <Text className="text-caption mb-spacing-8 pl-spacing-8 font-cairo font-bold uppercase tracking-widest text-text-secondary">
            {t('profile:preferences.title')}
          </Text>
          <View className="overflow-hidden rounded-radius-large border border-surface-border bg-surface-surface shadow-sm">
            <ProfileListItem
              title={t('profile:preferences.language')}
              iconName="globe"
              onPress={() => languageBottomSheetRef.current?.present()}
              rightElement={
                <View className="flex-row items-center gap-2">
                  <Text className="text-bodySmall font-cairo font-bold text-brand-primary">
                    {currentLanguage === 'ar' ? 'العربية' : 'English'}
                  </Text>
                  <Icon as={ChevronDown} size={16} className="text-brand-primary" />
                </View>
              }
            />
            <ProfileListItem
              title={t('profile:preferences.themeMode')}
              iconName="moon"
              showDivider={false}
              onPress={() => themeBottomSheetRef.current?.present()}
              rightElement={
                <View className="flex-row items-center gap-2">
                  <Text className="text-bodySmall font-cairo font-bold capitalize text-brand-primary">
                    {mode === 'light'
                      ? t('profile:preferences.lightMode')
                      : mode === 'dark'
                        ? t('profile:preferences.darkMode')
                        : t('profile:preferences.systemDefault')}
                  </Text>
                  <Icon as={ChevronDown} size={16} className="text-brand-primary" />
                </View>
              }
            />
          </View>
        </View>

        <View className="mb-spacing-32 px-spacing-16">
          <Text className="text-caption mb-spacing-8 pl-spacing-8 font-cairo font-bold uppercase tracking-widest text-text-secondary">
            {t('profile:support.title')}
          </Text>
          <View className="overflow-hidden rounded-radius-large border border-surface-border bg-surface-surface shadow-sm">
            <ProfileListItem title={t('profile:support.helpCenter')} iconName="help" />
            <ProfileListItem
              title={t('profile:support.privacyPolicy')}
              iconName="privacy"
              showDivider={false}
            />
          </View>
        </View>

        <View className="px-spacing-16 pb-spacing-32">
          <Pressable
            className="h-14 flex-row items-center justify-center gap-spacing-8 rounded-radius-large border border-brand-error/20 bg-status-error-container shadow-sm active:bg-brand-error/20"
            onPress={handleLogout}>
            <Icon as={LogOut} size={20} className="text-status-error" />
            <Text className="text-bodyLarge font-cairo font-bold text-status-error">
              {t('profile:logout.button')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal visible={logoutModalVisible} transparent animationType="fade">
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-4"
          onPress={() => setLogoutModalVisible(false)}>
          <Pressable
            className="w-full max-w-[320px] rounded-radius-large border border-surface-border bg-surface-surface p-spacing-24 shadow-xl"
            onPress={(e) => e.stopPropagation()}>
            <Text className="text-bodyLarge mb-spacing-8 text-center font-cairo font-bold text-text-primary">
              {t('profile:logout.confirmTitle')}
            </Text>
            <Text className="text-bodySmall mb-spacing-24 text-center font-cairo leading-[20px] text-text-secondary">
              {t('profile:logout.confirmMessage')}
            </Text>

            <View className="gap-y-spacing-16">
              <Pressable
                onPress={() => {
                  setLogoutModalVisible(false);
                  dispatch(logoutUser());
                }}
                className="active:bg-brand-primaryPressed h-12 flex-row items-center justify-center rounded-radius-medium bg-brand-error shadow-sm">
                <Text className="text-body font-cairo font-bold text-text-inverse">
                  {t('profile:logout.button')}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setLogoutModalVisible(false)}
                className="bg-surface-surfaceVariant/60 h-12 flex-row items-center justify-center rounded-radius-medium border border-surface-border active:bg-surface-border/40">
                <Text className="text-body font-cairo font-bold text-text-secondary">
                  {t('profile:cancel')}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Theme Selection Modal */}
      <AppBottomSheet ref={themeBottomSheetRef} enablePanDownToClose>
        <View className="px-6 pb-6">
          <View className="mb-6 items-center">
            <Text className="font-cairo text-xl font-bold text-text-primary">
              {t('profile:themeModal.title')}
            </Text>
          </View>

          <View className="bg-surface-surfaceVariant overflow-hidden rounded-xl px-4">
            {renderThemeOption('system', t('profile:preferences.systemDefault'))}
            {renderThemeOption('light', t('profile:preferences.lightMode'))}
            {renderThemeOption('dark', t('profile:preferences.darkMode'))}
          </View>

          <Pressable
            onPress={() => themeBottomSheetRef.current?.dismiss()}
            className="mt-6 h-12 flex-row items-center justify-center rounded-radius-medium bg-brand-primary shadow-sm active:opacity-90">
            <Text className="text-body font-cairo font-bold text-white">
              {t('profile:themeModal.done')}
            </Text>
          </Pressable>
        </View>
      </AppBottomSheet>

      {/* Language Selection Modal */}
      <LanguageSelectionModal ref={languageBottomSheetRef} />
    </SafeAreaView>
  );
}
