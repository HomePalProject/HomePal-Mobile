import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { TextField } from '@/src/components/ui/text-field';
import { Checkbox } from '@/src/components/ui/checkbox';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { clearError, saveTempRegistration } from '@/src/store/slices/authSlice';
import { registerFormSchema } from '@/src/utils/validation';
import { useGoogleAuth } from '@/src/hooks/useGoogleAuth';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

export const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  // Only the loading flag is needed here — the Google button itself lives in the
  // (forms) layout, since it is identical on both forms.
  const { isGoogleLoading } = useGoogleAuth();
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
        <Text className="font-cairo text-[16px] font-bold text-white">
          {t('auth:register.continueBtn')}
        </Text>
      </Button>
    </View>
  );
};

export default RegisterScreen;
