import React, { useState, useEffect, useRef } from 'react';

import { View, Pressable, Image, Animated, Dimensions, Modal, StyleSheet } from 'react-native';

import { router, Href, usePathname } from 'expo-router';

import {
  Home,
  Users,
  Send,
  Mail,
  User,
  LogOut,
  Sun,
  Moon,
  ShoppingCart,
  Wallet,
} from 'lucide-react-native';

import { Text } from '@/src/components/ui/text';

import { Icon } from '@/src/components/ui/icon';

import { useAppSelector, useAppDispatch } from '@/src/store';

import { logoutUser } from '@/src/store/slices/authSlice';

import { closeDrawer } from '@/src/store/slices/uiSlice';

import { useTheme } from '@/src/providers/ThemeProvider';

import { useColorScheme } from 'nativewind';

import { lightColors, darkColors } from '@/src/theme/colors';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useDrawerStore } from '@/src/store/useDrawerStore';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 320);

export function AppDrawer({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  const dispatch = useAppDispatch();

  const insets = useSafeAreaInsets();

  const { colorScheme } = useColorScheme();

  const themeColors = colorScheme === 'dark' ? darkColors : lightColors;

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const { resolvedMode, setMode } = useTheme();
  const { t } = useTranslation('common');

  const checkActive = (route: string) => {
    const cleanPathname = pathname.replace(/\/\([^)]+\)/g, '');

    const cleanRoute = route.replace(/\/\([^)]+\)/g, '');

    if (cleanRoute === '/(tabs)' || cleanRoute === '/tabs' || cleanRoute === '/') {
      return cleanPathname === '/' || cleanPathname === '/index';
    }

    return cleanPathname === cleanRoute;
  };

  const isOpen = useDrawerStore((state) => state.isOpen);
  const handleCloseDrawer = useDrawerStore((state) => state.closeDrawer);
  const { fullName, email, profileImageUri, hasHousehold, isManager } = useAppSelector(
    (state) => state.profile
  );

  const isRTL = I18nManager.isRTL;
  const closedPosition = isRTL ? DRAWER_WIDTH : -DRAWER_WIDTH;

  const slideAnim = useRef(new Animated.Value(closedPosition)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),

        Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: closedPosition,
          duration: 250,

          useNativeDriver: true,
        }),

        Animated.timing(opacityAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [isOpen, slideAnim, opacityAnim, closedPosition]);

  const userInitial = fullName ? fullName.trim()[0]?.toUpperCase() : 'M';

  const displayEmail = email || 'user@homepal.app';

  const navigateTo = (href: string) => {
    handleCloseDrawer();

    router.push(href as Href);
  };

  const handleConfirmLogout = async () => {
    setLogoutModalVisible(false);

    handleCloseDrawer();

    try {
      await dispatch(logoutUser()).unwrap();
    } catch {
      // Fallback
    } finally {
      router.replace('/(auth)/login' as Href);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 1. Main App Content */}

      <View style={{ flex: 1 }}>{children}</View>

      {/* 2. Drawer Overlay */}

      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'}

        style={[StyleSheet.absoluteFill, { zIndex: 100 }]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,

            { backgroundColor: 'rgba(0,0,0,0.5)', opacity: opacityAnim },
          ]}>
          <Pressable style={{ flex: 1 }} onPress={handleCloseDrawer} />
        </Animated.View>

        <Animated.View
          className="bg-surface-surface"

          style={[
            styles.drawerPanel,

            {
              position: 'absolute',

              left: 0,

              top: 0,

              bottom: 0,

              start: 0,
              width: DRAWER_WIDTH,

              transform: [{ translateX: slideAnim }],
            },
          ]}>
          <View
            className="bg-brand-primary-pressed px-5 pb-6"

            style={{ paddingTop: Math.max(insets.top, 16) + 16 }}>
            <View className="flex-row items-center gap-4">
              <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-brand-primary-container">
                {profileImageUri ? (
                  <Image
                    source={{ uri: profileImageUri }}

                    className="h-full w-full"

                    resizeMode="cover"
                  />
                ) : (
                  <Text className="font-cairo text-[22px] font-bold text-brand-primary-pressed">
                    {userInitial}
                  </Text>
                )}
              </View>

              <View className="flex-1">
                <Text
                  className="font-cairo text-[18px] font-bold leading-[24px] text-white"

                  numberOfLines={1}>
                  {fullName || 'User'}
                </Text>

                <Text className="mt-0.5 font-cairo text-[13px] text-slate-200" numberOfLines={1}>
                  {displayEmail}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-1 bg-surface-surface px-3 pt-4" style={{ gap: 6 }}>
            {(() => {
              const isActive = checkActive('/(tabs)');

              return (
                <Pressable
                  onPress={() => navigateTo('/(tabs)')}

                  className={[
                    'flex-row items-center gap-3.5 rounded-full px-4 py-3.5',

                    isActive
                      ? 'bg-brand-primary'
                      : 'active:bg-surface-surfaceVariant bg-transparent',
                  ]
                    .filter(Boolean)
                    .join(' ')}>
                  <Icon
                    as={Home}

                    size={22}

                    className={[isActive ? 'text-text-inverse' : 'text-text-primary']
                      .filter(Boolean)
                      .join(' ')}
                  />

                  <Text
                    className={[
                      'font-cairo text-[15px] font-semibold',

                      isActive ? 'text-text-inverse' : 'text-text-primary',
                    ]
                      .filter(Boolean)
                      .join(' ')}>
                    {t('navigation.myHousehold')}
                  </Text>
                </Pressable>
              );
            })()}

            {/* Shopping List Button */}

            {(() => {
              const isActive = checkActive('/(households)/shopping-list');

              return (
                <Pressable
                  onPress={() => hasHousehold && navigateTo('/(households)/shopping-list')}

                  disabled={!hasHousehold}

                  style={{ opacity: !hasHousehold ? 0.4 : 1 }}

                  className={[
                    'flex-row items-center gap-3.5 rounded-full px-4 py-3.5',

                    isActive
                      ? 'bg-brand-primary'
                      : 'active:bg-surface-surfaceVariant bg-transparent',
                  ]
                    .filter(Boolean)
                    .join(' ')}>
                  <Icon
                    as={ShoppingCart}

                    size={22}

                    className={[isActive ? 'text-text-inverse' : 'text-text-primary']
                      .filter(Boolean)
                      .join(' ')}
                  />

                  <Text
                    className={[
                      'font-cairo text-[15px] font-semibold',

                      isActive ? 'text-text-inverse' : 'text-text-primary',
                    ]
                      .filter(Boolean)
                      .join(' ')}>
                    {t('navigation.shoppingList')}
                  </Text>
                </Pressable>
              );
            })()}

            {/* Household Budget Button */}

            {(() => {
              const isActive = checkActive('/(households)/budget');

              return (
                <Pressable
                  onPress={() => hasHousehold && navigateTo('/(households)/budget')}

                  disabled={!hasHousehold}

                  style={{ opacity: !hasHousehold ? 0.4 : 1 }}

                  className={[
                    'flex-row items-center gap-3.5 rounded-full px-4 py-3.5',

                    isActive
                      ? 'bg-brand-primary'
                      : 'active:bg-surface-surfaceVariant bg-transparent',
                  ]
                    .filter(Boolean)
                    .join(' ')}>
                  <Icon
                    as={Wallet}

                    size={22}

                    className={[isActive ? 'text-text-inverse' : 'text-text-primary']
                      .filter(Boolean)
                      .join(' ')}
                  />

                  <Text
                    className={[
                      'font-cairo text-[15px] font-semibold',

                      isActive ? 'text-text-inverse' : 'text-text-primary',
                    ]
                      .filter(Boolean)
                      .join(' ')}>
                    {t('navigation.householdBudget')}
                  </Text>
                </Pressable>
              );
            })()}

            {(() => {
              const isActive = checkActive('/(households)/family-management');

              return (
                <Pressable
                  onPress={() => hasHousehold && navigateTo('/(households)/family-management')}

                  disabled={!hasHousehold}

                  style={{ opacity: !hasHousehold ? 0.4 : 1 }}

                  className={[
                    'flex-row items-center gap-3.5 rounded-full px-4 py-3.5',

                    isActive
                      ? 'bg-brand-primary'
                      : 'active:bg-surface-surfaceVariant bg-transparent',
                  ]
                    .filter(Boolean)
                    .join(' ')}>
                  <Icon
                    as={Users}

                    size={22}

                    className={[isActive ? 'text-text-inverse' : 'text-text-primary']
                      .filter(Boolean)
                      .join(' ')}
                  />

                  <Text
                    className={[
                      'font-cairo text-[15px] font-semibold',

                      isActive ? 'text-text-inverse' : 'text-text-primary',
                    ]
                      .filter(Boolean)
                      .join(' ')}>
                    {t('navigation.manageFamily')}
                  </Text>
                </Pressable>
              );
            })()}

            {(() => {
              const isActive = checkActive('/(households)/invite');

              return (
                <Pressable
                  onPress={() => hasHousehold && isManager && navigateTo('/(households)/invite')}

                  disabled={!hasHousehold || !isManager}

                  style={{ opacity: !hasHousehold || !isManager ? 0.4 : 1 }}

                  className={[
                    'flex-row items-center gap-3.5 rounded-full px-4 py-3.5',

                    isActive
                      ? 'bg-brand-primary'
                      : 'active:bg-surface-surfaceVariant bg-transparent',
                  ]
                    .filter(Boolean)
                    .join(' ')}>
                  <Icon
                    as={Send}

                    size={22}

                    className={[isActive ? 'text-text-inverse' : 'text-text-primary']
                      .filter(Boolean)
                      .join(' ')}
                  />

                  <Text
                    className={[
                      'font-cairo text-[15px] font-semibold',

                      isActive ? 'text-text-inverse' : 'text-text-primary',
                    ]
                      .filter(Boolean)
                      .join(' ')}>
                    {t('navigation.sentInvitations')}
                  </Text>
                </Pressable>
              );
            })()}

            {(() => {
              const isActive = checkActive('/(households)/invitations');

              return (
                <Pressable
                  onPress={() => !hasHousehold && navigateTo('/(households)/invitations')}

                  disabled={hasHousehold}

                  style={{ opacity: hasHousehold ? 0.4 : 1 }}

                  className={[
                    'flex-row items-center gap-3.5 rounded-full px-4 py-3.5',

                    isActive
                      ? 'bg-brand-primary'
                      : 'active:bg-surface-surfaceVariant bg-transparent',
                  ]
                    .filter(Boolean)
                    .join(' ')}>
                  <Icon
                    as={Mail}

                    size={22}

                    className={[isActive ? 'text-text-inverse' : 'text-text-primary']
                      .filter(Boolean)
                      .join(' ')}
                  />

                  <Text
                    className={[
                      'font-cairo text-[15px] font-semibold',

                      isActive ? 'text-text-inverse' : 'text-text-primary',
                    ]
                      .filter(Boolean)
                      .join(' ')}>
                    {t('navigation.receivedInvitations')}
                  </Text>
                </Pressable>
              );
            })()}

            {(() => {
              const isActive = checkActive('/profile');

              return (
                <Pressable
                  onPress={() => navigateTo('/profile')}

                  className={[
                    'flex-row items-center gap-3.5 rounded-full px-4 py-3.5',

                    isActive
                      ? 'bg-brand-primary'
                      : 'active:bg-surface-surfaceVariant bg-transparent',
                  ]
                    .filter(Boolean)
                    .join(' ')}>
                  <Icon
                    as={User}

                    size={22}

                    className={[isActive ? 'text-text-inverse' : 'text-text-primary']
                      .filter(Boolean)
                      .join(' ')}
                  />

                  <Text
                    className={[
                      'font-cairo text-[15px] font-semibold',

                      isActive ? 'text-text-inverse' : 'text-text-primary',
                    ]
                      .filter(Boolean)
                      .join(' ')}>
                    {t('navigation.profileSettings')}
                  </Text>
                </Pressable>
              );
            })()}

            <Pressable
              onPress={toggleTheme}

              className="active:bg-surface-surfaceVariant flex-row items-center justify-between rounded-full px-4 py-3.5">
              <View className="flex-row items-center gap-3.5">
                <Icon
                  as={resolvedMode === 'dark' ? Moon : Sun}

                  size={22}

                  className="text-text-primary"
                />

                <Text className="font-cairo text-[15px] font-semibold text-text-primary">
                  {resolvedMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
            </Pressable>
          </View>

          <View
            className="border-t border-surface-border bg-surface-surface px-4 pt-4"

            style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
            <Pressable
              onPress={() => setLogoutModalVisible(true)}

              className="h-12 w-full flex-row items-center justify-center gap-2 rounded-full"

              style={{ backgroundColor: '#C82333' }}>
              <Icon as={LogOut} size={20} color="#ffffff" />

              <Text className="font-cairo text-[16px] font-bold text-white">Sign Out</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>

      {logoutModalVisible && (
        <Modal
          animationType="fade"

          transparent={true}

          visible={true}

          onRequestClose={() => setLogoutModalVisible(false)}>
          <Pressable
            className="flex-1 items-center justify-center bg-black/50 px-6"

            onPress={() => setLogoutModalVisible(false)}>
            <Pressable
              className="w-full max-w-[320px] rounded-2xl border border-surface-border bg-surface-surface p-6 shadow-xl"

              onPress={(e) => e.stopPropagation()}>
              <Text className="mb-2 text-center font-cairo text-[18px] font-bold text-text-primary">
                Confirm Logout
              </Text>

              <Text className="mb-6 text-center font-cairo text-[14px] leading-[20px] text-text-secondary">
                Are you sure you want to log out of HomePal?
              </Text>

              <View style={{ gap: 12 }}>
                <Pressable
                  onPress={handleConfirmLogout}

                  className="h-12 flex-row items-center justify-center rounded-xl bg-brand-error">
                  <Text className="font-cairo text-[15px] font-bold text-white">Log Out</Text>
                </Pressable>

                <Pressable
                  onPress={() => setLogoutModalVisible(false)}

                  className="h-12 flex-row items-center justify-center rounded-xl border border-surface-border">
                  <Text className="font-cairo text-[15px] font-bold text-text-secondary">
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerPanel: {
    height: '100%',

    shadowColor: '#000',

    shadowOffset: { width: 4, height: 0 },

    shadowOpacity: 0.15,

    shadowRadius: 10,

    elevation: 10,
  },
});
