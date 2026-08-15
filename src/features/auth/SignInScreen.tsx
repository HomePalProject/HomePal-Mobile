import React, { useState } from 'react';
import { View, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { TextField } from '@/src/components/ui/text-field';
import { Icon } from '@/src/components/ui/icon';
import { Home } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { loginUser, clearError } from '@/src/store/slices/authSlice';
import { loginFormSchema } from '@/src/utils/validation';
import { toast } from '@/src/providers/ToastProvider';
import { useGoogleAuth } from '@/src/hooks/useGoogleAuth';
import { useTranslation } from 'react-i18next';
import { ErrorBanner } from '@/src/components/common/ErrorBanner';
import { AnimatedPressable } from '@/src/components/ui/animated-pressable';
import * as Haptics from 'expo-haptics';

export const SignInScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  const { handleGoogleSignIn, isGoogleLoading } = useGoogleAuth();
  const { t } = useTranslation(['auth', 'common']);

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const handleSignIn = async () => {
    const validation = loginFormSchema.safeParse({ emailOrUsername, password });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err: any) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      toast.error(t('auth:login.validationErrorTitle'), t('auth:login.validationErrorMsg'));
      return;
    }

    setErrors({});
    if (authError) dispatch(clearError());

    try {
      await dispatch(loginUser({ emailOrUsername: emailOrUsername.trim(), password })).unwrap();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success(t('auth:login.successTitle'), t('auth:login.successMsg'));
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      toast.error(t('auth:login.failedTitle'), err.message || t('auth:login.failedMsg'));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
          className="px-6 py-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View className="flex-col gap-6">
            {/* Header & Logo */}
            <View className="flex-row items-center gap-2 py-2">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-brand-primary">
                <Icon as={Home} size={18} className="text-white" />
              </View>
              <Text className="font-cairo text-[20px] font-bold text-brand-primary">HomePal</Text>
            </View>

            {/* Heading */}
            <View className="flex-col gap-1">
              <Text className="font-cairo text-[28px] font-bold leading-[36px] text-text-primary">
                {t('auth:login.title')}
              </Text>
              <Text className="font-cairo text-[15px] leading-[22px] text-text-secondary">
                {t('auth:login.subtitle')}
              </Text>
            </View>

            {/* Segmented Auth Toggle */}
            <View className="flex-row rounded-[12px] bg-surface-surface-variant p-1">
              <View className="flex-1 items-center justify-center rounded-[8px] border border-surface-border bg-surface-surface py-2.5">
                <Text className="font-cairo text-[14px] font-bold text-text-primary">{t('auth:login.signInBtn')}</Text>
              </View>
              <AnimatedPressable
                onPress={() => {
                  if (authError) dispatch(clearError());
                  router.replace('/(auth)/register');
                }}
                hapticStyle="light"
                className="flex-1 items-center justify-center rounded-[8px] py-2.5">
                <Text className="font-cairo text-[14px] font-medium text-text-secondary">
                  {t('auth:login.createAccount')}
                </Text>
              </AnimatedPressable>
            </View>

            {/* Backend Error Banner */}
            {authError ? <ErrorBanner message={authError} /> : null}

            {/* Form */}
            <View className="mt-2 flex-col gap-4">
              <TextField
                label={t('auth:login.emailLabel')}
                placeholder={t('auth:login.emailPlaceholder')}
                value={emailOrUsername}
                onChangeText={(val) => {
                  setEmailOrUsername(val);
                  if (errors.emailOrUsername) setErrors({ ...errors, emailOrUsername: undefined });
                  if (authError) dispatch(clearError());
                }}
                error={errors.emailOrUsername}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <View className="flex-col gap-2">
                <TextField
                  label={t('auth:login.passwordLabel')}
                  placeholder={t('auth:login.passwordPlaceholder')}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                    if (authError) dispatch(clearError());
                  }}
                  error={errors.password}
                  secureTextEntry
                />
                <Pressable
                  onPress={() => router.push('/(auth)/forgot-password')}
                  className="self-end">
                  <Text className="font-cairo text-[13px] font-semibold text-brand-primary">
                    {t('auth:login.forgotPassword')}
                  </Text>
                </Pressable>
              </View>

              {/* Primary CTA */}
              <Button
                onPress={handleSignIn}
                disabled={isLoading || isGoogleLoading}
                isLoading={isLoading}
                hapticStyle="medium"
                className="mt-2 h-[56px] w-full rounded-full bg-brand-primary">
                <Text className="font-cairo text-[16px] font-bold text-white">
                  {isLoading ? t('auth:login.signingInBtn') : t('auth:login.signInBtn')}
                </Text>
              </Button>
            </View>

            {/* Divider */}
            <View className="my-2 flex-row items-center gap-3">
              <View className="h-[1px] flex-1 bg-surface-border" />
              <Text className="font-cairo text-[13px] text-text-disabled">{t('auth:login.orContinueWith')}</Text>
              <View className="h-[1px] flex-1 bg-surface-border" />
            </View>

            {/* Social Auth Button */}
            <Button
              variant="outline"
              onPress={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              isLoading={isGoogleLoading}
              hapticStyle="light"
              className="h-[52px] w-full flex-row items-center justify-center gap-3 rounded-[12px] border border-surface-border bg-surface-surface">
              <Text className="font-cairo text-[15px] font-semibold text-text-primary">
                {t('auth:login.continueWithGoogle')}
              </Text>
            </Button>
          </View>
          {/* Footer */}
          <View className="mt-8 flex-row items-center justify-center pb-4">
            <Text className="font-cairo text-[14px] text-text-secondary">{t('auth:login.newToHomePal')}</Text>
            <Pressable
              onPress={() => {
                if (authError) dispatch(clearError());
                router.replace('/(auth)/register');
              }}>
              <Text className="font-cairo text-[14px] font-bold text-brand-primary">
                {t('auth:login.createAccount')}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
