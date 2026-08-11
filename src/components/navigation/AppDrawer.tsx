import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Pressable,
  Image,
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Easing,
} from 'react-native';
import { router, Href, usePathname } from 'expo-router';
import { Home, Users, Send, Mail, User, LogOut } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { useAppSelector } from '@/src/store';
import { useAppDispatch } from '@/src/store';
import { logoutUser } from '@/src/store/slices/authSlice';
import { closeDrawer } from '@/src/store/slices/uiSlice';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 320);

import { useColorScheme } from 'nativewind';
import { lightColors, darkColors } from '@/src/theme/colors';

// ... (in the component)
export function AppDrawer({ children }: { children?: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const themeColors = colorScheme === 'dark' ? darkColors : lightColors;
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const isOpen = useAppSelector((state) => state.ui.isDrawerOpen);
  const handleCloseDrawer = () => dispatch(closeDrawer());
  const { fullName, email, profileImageUri, hasHousehold, isManager } = useAppSelector(
    (state) => state.profile
  );
  const pathname = usePathname();

  const activeRoute = React.useMemo(() => {
    if (pathname === '/' || pathname === '/(tabs)') return 'household';
    if (pathname === '/family-management' || pathname === '/(households)/family-management')
      return 'members';
    if (pathname === '/invite' || pathname === '/(households)/invite') return 'sent_invites';
    if (pathname === '/invitations' || pathname === '/(households)/invitations')
      return 'received_invites';
    if (pathname === '/profile' || pathname === '/(tabs)/profile') return 'profile';
    return '';
  }, [pathname]);

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, slideAnim, opacityAnim]);

  const userInitial = fullName ? fullName.trim()[0]?.toUpperCase() : 'M';
  const displayEmail = email || 'user@homepal.app';

  const navigateTo = (routeKey: string, href: string) => {
    handleCloseDrawer();
    router.push(href as Href);
  };

  const handleOpenLogoutModal = () => {
    setLogoutModalVisible(true);
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

  const DrawerItem = ({ route, icon, label, disabled = false, href }: any) => {
    const isActive = activeRoute === route;
    return (
      <Pressable
        onPress={() => !disabled && navigateTo(route, href)}
        disabled={disabled}
        className={`flex-row items-center gap-3.5 rounded-full px-4 py-3.5 active:opacity-80 ${
          isActive ? 'shadow-sm' : 'active:bg-surface-surfaceVariant'
        }`}
        style={[
          { opacity: disabled ? 0.4 : 1 },
          isActive && { backgroundColor: themeColors.brand.primary },
        ]}>
        <Icon
          as={icon}
          size={22}
          color={isActive ? themeColors.text.inverse : themeColors.text.primary}
        />
        <Text
          className={`font-cairo text-[15px] ${isActive ? 'font-bold' : 'font-semibold'}`}
          style={{ color: isActive ? themeColors.text.inverse : themeColors.text.primary }}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ── 1. The Main App Content ── */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* ── 2. The Drawer Overlay ── */}
      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'}
        style={[StyleSheet.absoluteFill, { zIndex: 100 }]}>
        {/* Dimmer Backdrop */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,0.5)', opacity: opacityAnim },
          ]}>
          <Pressable style={{ flex: 1 }} onPress={handleCloseDrawer} />
        </Animated.View>

        {/* Sliding Drawer Panel */}
        <Animated.View
          className="bg-surface-surface"
          style={[
            styles.drawerPanel,
            {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: DRAWER_WIDTH,
              transform: [{ translateX: slideAnim }],
            },
          ]}>
          {/* ── 1. Top Header (Dark Green Container) ── */}
          <View
            className="bg-brand-primary-pressed px-5 pb-6"
            style={{ paddingTop: Math.max(insets.top, 16) + 16 }}>
            <View className="flex-row items-center gap-4">
              {/* User Avatar Circle */}
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

              {/* User Name & Email */}
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
            <DrawerItem route="household" icon={Home} label="My Household" href="/(tabs)" />
            <DrawerItem
              route="members"
              icon={Users}
              label="Manage Family"
              href="/(households)/family-management"
              disabled={!hasHousehold}
            />
            <DrawerItem
              route="sent_invites"
              icon={Send}
              label="Sent Invitations"
              href="/(households)/invite"
              disabled={!hasHousehold || !isManager}
            />
            <DrawerItem
              route="received_invites"
              icon={Mail}
              label="Received Invitations"
              href="/(households)/invitations"
              disabled={hasHousehold}
            />
            <DrawerItem route="profile" icon={User} label="Profile & Settings" href="/profile" />
          </View>

          {/* ── 3. Footer (Sign Out Button) ── */}
          <View
            className="border-t border-surface-border bg-surface-surface px-4 pt-4"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
            <Pressable
              onPress={handleOpenLogoutModal}
              className="h-12 w-full flex-row items-center justify-center gap-2 rounded-full active:opacity-90"
              style={{ backgroundColor: '#C82333' }}
              accessibilityRole="button"
              accessibilityLabel="Sign Out">
              <Icon as={LogOut} size={20} color="#ffffff" />
              <Text className="font-cairo text-[16px] font-bold text-white">Sign Out</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
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
                className="h-12 flex-row items-center justify-center rounded-xl bg-brand-error shadow-sm active:opacity-90">
                <Text className="font-cairo text-[15px] font-bold text-white">Log Out</Text>
              </Pressable>

              <Pressable
                onPress={() => setLogoutModalVisible(false)}
                className="bg-surface-surfaceVariant/60 h-12 flex-row items-center justify-center rounded-xl border border-surface-border active:opacity-80">
                <Text className="font-cairo text-[15px] font-bold text-text-secondary">Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
