import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { TextField } from '@/src/components/ui/text-field';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { loginUser, clearError } from '@/src/store/slices/authSlice';
import { loginFormSchema } from '@/src/utils/validation';
import { toast } from '@/src/providers/ToastProvider';
import { useGoogleAuth } from '@/src/hooks/useGoogleAuth';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

export const SignInScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  // Only the loading flag is needed here — the Google button itself lives in the
  // (forms) layout, since it is identical on both forms.
  const { isGoogleLoading } = useGoogleAuth();
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
        <Pressable onPress={() => router.push('/(auth)/forgot-password')} className="self-end">
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
  );
};

export default SignInScreen;
