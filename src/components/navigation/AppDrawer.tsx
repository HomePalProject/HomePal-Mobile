import React, { useState, useEffect, useRef } from 'react';
import { View, Pressable, Image, Animated, Dimensions, Modal, StyleSheet } from 'react-native';
import { router, Href } from 'expo-router';
import { Home, Users, Send, Mail, User, LogOut } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { useProfileStore } from '@/src/store/useProfileStore';
import { useDrawerStore } from '@/src/store/useDrawerStore';
import { useAppDispatch } from '@/src/store';
import { logoutUser } from '@/src/store/slices/authSlice';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 320);

export function AppDrawer() {
  const dispatch = useAppDispatch();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const { isOpen, closeDrawer, activeRoute, setActiveRoute } = useDrawerStore();
  const { fullName, email, profileImageUri } = useProfileStore();

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
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, slideAnim, opacityAnim]);

  if (!isOpen) return null;

  const userInitial = fullName ? fullName.trim()[0]?.toUpperCase() : 'M';
  const displayEmail = email || 'user@homepal.app';

  const navigateTo = (routeKey: string, href: string) => {
    setActiveRoute(routeKey);
    closeDrawer();
    router.push(href as Href);
  };

  const handleOpenLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    setLogoutModalVisible(false);
    closeDrawer();
    try {
      await dispatch(logoutUser()).unwrap();
    } catch {
      // Fallback
    } finally {
      router.replace('/(auth)/login' as Href);
    }
  };

  return (
    <>
      <Modal transparent visible={isOpen} animationType="none" onRequestClose={closeDrawer}>
        <View style={StyleSheet.absoluteFill} className="flex-1">
          {/* Backdrop Overlay */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { opacity: opacityAnim, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            ]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
          </Animated.View>

          {/* Sliding Panel */}
          <Animated.View
            style={[
              styles.drawerPanel,
              {
                width: DRAWER_WIDTH,
                transform: [{ translateX: slideAnim }],
              },
            ]}>
            {/* ── 1. Top Header (Dark Green Container) ── */}
            <View className="bg-[#1b5042] px-5 pb-6 pt-12">
              <View className="flex-row items-center gap-4">
                {/* User Avatar Circle */}
                <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-[#C8D5D0]">
                  {profileImageUri ? (
                    <Image
                      source={{ uri: profileImageUri }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="font-cairo text-[22px] font-bold text-[#1b5042]">
                      {userInitial}
                    </Text>
                  )}
                </View>

                {/* User Name & Email */}
                <View className="flex-1">
                  <Text
                    className="font-cairo text-[18px] font-bold leading-[24px] text-white"
                    numberOfLines={1}>
                    {fullName || 'Mariam Essam2'}
                  </Text>
                  <Text className="mt-0.5 font-cairo text-[13px] text-slate-200" numberOfLines={1}>
                    {displayEmail}
                  </Text>
                </View>
              </View>
            </View>

            {/* ── 2. Navigation Menu Items ── */}
            <View className="flex-1 bg-white px-3 pt-4" style={{ gap: 6 }}>
              {/* Item 1: My Household */}
              <Pressable
                onPress={() => navigateTo('household', '/(tabs)')}
                className={`flex-row items-center gap-3.5 rounded-full px-4 py-3.5 active:opacity-80 ${
                  activeRoute === 'household'
                    ? 'bg-[#356859] shadow-sm'
                    : 'active:bg-surface-surfaceVariant'
                }`}>
                <Icon
                  as={Home}
                  size={22}
                  color={activeRoute === 'household' ? '#ffffff' : '#1e1b17'}
                />
                <Text
                  className={`font-cairo text-[15px] ${
                    activeRoute === 'household'
                      ? 'font-bold text-white'
                      : 'font-semibold text-[#1e1b17]'
                  }`}>
                  My Household
                </Text>
              </Pressable>

              {/* Item 2: Household Members */}
              <Pressable
                onPress={() => navigateTo('members', '/(tabs)')}
                className={`flex-row items-center gap-3.5 rounded-full px-4 py-3.5 active:opacity-80 ${
                  activeRoute === 'members'
                    ? 'bg-[#356859] shadow-sm'
                    : 'active:bg-surface-surfaceVariant'
                }`}>
                <Icon
                  as={Users}
                  size={22}
                  color={activeRoute === 'members' ? '#ffffff' : '#1e1b17'}
                />
                <Text
                  className={`font-cairo text-[15px] ${
                    activeRoute === 'members'
                      ? 'font-bold text-white'
                      : 'font-semibold text-[#1e1b17]'
                  }`}>
                  Household Members
                </Text>
              </Pressable>

              {/* Item 3: Sent Invitations */}
              <Pressable
                onPress={() => navigateTo('sent_invites', '/(households)/invite')}
                className={`flex-row items-center gap-3.5 rounded-full px-4 py-3.5 active:opacity-80 ${
                  activeRoute === 'sent_invites'
                    ? 'bg-[#356859] shadow-sm'
                    : 'active:bg-surface-surfaceVariant'
                }`}>
                <Icon
                  as={Send}
                  size={22}
                  color={activeRoute === 'sent_invites' ? '#ffffff' : '#1e1b17'}
                />
                <Text
                  className={`font-cairo text-[15px] ${
                    activeRoute === 'sent_invites'
                      ? 'font-bold text-white'
                      : 'font-semibold text-[#1e1b17]'
                  }`}>
                  Sent Invitations
                </Text>
              </Pressable>

              {/* Item 4: Received Invitations */}
              <Pressable
                onPress={() => navigateTo('received_invites', '/(households)/invitations')}
                className={`flex-row items-center gap-3.5 rounded-full px-4 py-3.5 active:opacity-80 ${
                  activeRoute === 'received_invites'
                    ? 'bg-[#356859] shadow-sm'
                    : 'active:bg-surface-surfaceVariant'
                }`}>
                <Icon
                  as={Mail}
                  size={22}
                  color={activeRoute === 'received_invites' ? '#ffffff' : '#1e1b17'}
                />
                <Text
                  className={`font-cairo text-[15px] ${
                    activeRoute === 'received_invites'
                      ? 'font-bold text-white'
                      : 'font-semibold text-[#1e1b17]'
                  }`}>
                  Received Invitations
                </Text>
              </Pressable>

              {/* Item 5: Profile & Settings */}
              <Pressable
                onPress={() => navigateTo('profile', '/profile')}
                className={`flex-row items-center gap-3.5 rounded-full px-4 py-3.5 active:opacity-80 ${
                  activeRoute === 'profile'
                    ? 'bg-[#356859] shadow-sm'
                    : 'active:bg-surface-surfaceVariant'
                }`}>
                <Icon
                  as={User}
                  size={22}
                  color={activeRoute === 'profile' ? '#ffffff' : '#1e1b17'}
                />
                <Text
                  className={`font-cairo text-[15px] ${
                    activeRoute === 'profile'
                      ? 'font-bold text-white'
                      : 'font-semibold text-[#1e1b17]'
                  }`}>
                  Profile & Settings
                </Text>
              </Pressable>
            </View>

            {/* ── 3. Footer (Sign Out Button) ── */}
            <View className="border-t border-surface-border bg-white p-4">
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
        </View>
      </Modal>

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
            className="w-full max-w-[320px] rounded-2xl border border-surface-border bg-white p-6 shadow-xl"
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
    </>
  );
}

const styles = StyleSheet.create({
  drawerPanel: {
    height: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
});
