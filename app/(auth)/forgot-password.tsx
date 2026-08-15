import React, { useState } from 'react';
import { View, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { TextField } from '@/src/components/ui/text-field';
import { Icon } from '@/src/components/ui/icon';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react-native';
import { authService } from '@/src/services/api/auth.service';
import { emailSchema } from '@/src/utils/validation';
import { toast } from '@/src/providers/ToastProvider';

import { useTranslation } from 'react-i18next';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendReset = async () => {
    // Validate email
    const result = emailSchema.safeParse(email.trim());
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(undefined);
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword({ email: email.trim() });
      if (response.success || response.status === 'Success' || response.status === 'OK') {
        toast.success(
          t('auth:forgotPassword.resetSuccessTitle'),
          t('auth:forgotPassword.resetSuccessMsg')
        );
        router.back();
      } else {
        const msg = response.message || t('common:errors.requestFailed');
        toast.error(t('common:errors.requestFailed'), msg);
        setError(msg);
      }
    } catch (err: any) {
      const msg = err.message || t('common:errors.unexpectedError');
      toast.error(t('common:errors.requestFailed'), msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 py-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Header Bar */}
          <View className="flex-row items-center py-2">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-surface-surface-variant">
              <Icon as={ArrowLeft} size={20} className="text-text-primary" />
            </Pressable>
          </View>

          {/* Title & Icon */}
          <View className="mt-8 items-center justify-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-brand-primary-container">
              <Icon as={KeyRound} size={36} className="text-brand-primary" />
            </View>
            <Text className="text-center font-cairo text-[26px] font-bold text-text-primary">
              {t('auth:forgotPassword.title')}
            </Text>
            <Text className="mt-2 px-4 text-center font-cairo text-[15px] leading-[22px] text-text-secondary">
              {t('auth:forgotPassword.subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View className="mt-8 flex-col gap-4">
            <TextField
              label={t('auth:forgotPassword.emailLabel')}
              placeholder={t('auth:forgotPassword.emailPlaceholder')}
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                if (error) setError(undefined);
              }}
              error={error}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Button
              onPress={handleSendReset}
              disabled={isLoading || !email.trim()}
              className="mt-4 h-[56px] w-full rounded-full bg-brand-primary">
              <Text className="font-cairo text-[16px] font-bold text-white">
                {isLoading ? t('auth:forgotPassword.sendingResetLink') : t('auth:forgotPassword.sendResetLink')}
              </Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
