import React, { useState } from 'react';
import { View, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { TextField } from '@/src/components/ui/text-field';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Icon } from '@/src/components/ui/icon';
import { Home } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { clearError, saveTempRegistration } from '@/src/store/slices/authSlice';
import { registerFormSchema } from '@/src/utils/validation';
import { useGoogleAuth } from '@/src/hooks/useGoogleAuth';
import { useTranslation } from 'react-i18next';
import { ErrorBanner } from '@/src/components/common/ErrorBanner';
import { AnimatedPressable } from '@/src/components/ui/animated-pressable';
import * as Haptics from 'expo-haptics';

export const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  const { handleGoogleSignIn, isGoogleLoading } = useGoogleAuth();
  const { t } = useTranslation(['auth', 'common']);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const handleRegister = async () => {
    // 1. Zod schema validation
    const result = registerFormSchema.safeParse({
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      terms: agreedToTerms,
    });

    if (!result.success) {
      const newErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof errors;
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });
      setErrors(newErrors);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setErrors({});
    if (authError) dispatch(clearError());

    // 2. Save validated credentials to temporary state and navigate to Step 1
    dispatch(
      saveTempRegistration({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      })
    );

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(onboarding)/step1');
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
                {t('auth:register.title')}
              </Text>
              <Text className="font-cairo text-[15px] leading-[22px] text-text-secondary">
                {t('auth:register.subtitle')}
              </Text>
            </View>

            {/* Segmented Auth Toggle */}
            <View className="flex-row rounded-[12px] bg-surface-surface-variant p-1">
              <AnimatedPressable
                onPress={() => {
                  if (authError) dispatch(clearError());
                  router.replace('/(auth)/login');
                }}
                hapticStyle="light"
                className="flex-1 items-center justify-center rounded-[8px] py-2.5">
                <Text className="font-cairo text-[14px] font-medium text-text-secondary">
                  {t('auth:login.signInBtn')}
                </Text>
              </AnimatedPressable>
              <View className="flex-1 items-center justify-center rounded-[8px] bg-surface-surface py-2.5 shadow-sm">
                <Text className="font-cairo text-[14px] font-bold text-text-primary">
                  {t('auth:login.createAccount')}
                </Text>
              </View>
            </View>

            {/* Backend Error Banner */}
            {authError ? <ErrorBanner message={authError} /> : null}

            {/* Form */}
            <View className="mt-2 flex-col gap-4">
              <TextField
                label={t('auth:register.fullNameLabel')}
                placeholder={t('auth:register.fullNamePlaceholder')}
                value={fullName}
                onChangeText={(val) => {
                  setFullName(val);
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  if (authError) dispatch(clearError());
                }}
                error={errors.fullName}
              />

              <TextField
                label={t('auth:register.usernameLabel')}
                placeholder={t('auth:register.usernamePlaceholder')}
                value={username}
                onChangeText={(val) => {
                  setUsername(val);
                  if (errors.username) setErrors({ ...errors, username: undefined });
                  if (authError) dispatch(clearError());
                }}
                error={errors.username}
                autoCapitalize="none"
              />

              <TextField
                label={t('auth:register.emailLabel')}
                placeholder={t('auth:register.emailPlaceholder')}
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                  if (authError) dispatch(clearError());
                }}
                error={errors.email}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextField
                label={t('auth:register.passwordLabel')}
                placeholder={t('auth:register.passwordPlaceholder')}
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                  if (authError) dispatch(clearError());
                }}
                error={errors.password}
                secureTextEntry
              />

              <TextField
                label={t('auth:register.confirmPasswordLabel')}
                placeholder={t('auth:register.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChangeText={(val) => {
                  setConfirmPassword(val);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  if (authError) dispatch(clearError());
                }}
                error={errors.confirmPassword}
                secureTextEntry
              />

              {/* Checkbox */}
              <View className="mt-1">
                <Checkbox
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => {
                    setAgreedToTerms(checked);
                    if (errors.terms) setErrors({ ...errors, terms: undefined });
                  }}
                  error={errors.terms}>
                  <Text className="font-cairo text-[14px] text-text-secondary">
                    {t('auth:register.agreeTo')}
                    <Text className="font-cairo text-[14px] font-bold text-brand-primary">
                      {t('auth:register.termsAndConditions')}
                    </Text>
                  </Text>
                </Checkbox>
              </View>

              {/* Primary CTA */}
              <Button
                onPress={handleRegister}
                disabled={isLoading || isGoogleLoading}
                isLoading={isLoading}
                hapticStyle="medium"
                className="mt-4 h-[56px] w-full rounded-full bg-brand-primary shadow-sm">
                <Text className="font-cairo text-[16px] font-bold text-white">{t('auth:register.continueBtn')}</Text>
              </Button>

              {/* Divider */}
              <View className="my-2 flex-row items-center gap-4">
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
          </View>

          {/* Footer */}
          <View className="mt-8 flex-row items-center justify-center pb-4">
            <Text className="font-cairo text-[14px] text-text-secondary">
              {t('auth:register.alreadyHaveAccount')}
            </Text>
            <Pressable
              onPress={() => {
                if (authError) dispatch(clearError());
                router.replace('/(auth)/login');
              }}>
              <Text className="font-cairo text-[14px] font-bold text-brand-primary">{t('auth:login.signInBtn')}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
