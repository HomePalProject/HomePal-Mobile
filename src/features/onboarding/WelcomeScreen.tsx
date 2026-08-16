import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { useTranslation } from 'react-i18next';

export const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('auth');

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <View className="flex-1 justify-between px-6 pb-8 pt-4">
        {/* Top Navigation / Branding */}
        <View className="items-center py-2">
          <Text className="font-cairo text-[28px] font-bold tracking-tight text-brand-primary">
            HomePal
          </Text>
        </View>

        {/* Hero Image Container */}
        <View className="my-4 items-center justify-center">
          <View className="h-[268px] w-full overflow-hidden rounded-[32px] border border-surface-border shadow-sm">
            <Image
              source={require('@/src/assets/images/welcome-hero.png')}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Typography Section */}
        <View className="flex-col gap-3 px-2 text-center">
          <Text className="text-center font-cairo text-[28px] font-bold leading-[36px] text-brand-primary">
            {t('welcome.title')}
          </Text>
          <Text className="text-center font-cairo text-[16px] leading-[24px] text-text-secondary">
            {t('welcome.subtitle')}
          </Text>
        </View>

        {/* Actions */}
        <View className="mt-4 flex-col gap-3">
          <Button
            onPress={() => router.push('/register')}
            className="h-[56px] w-full rounded-full bg-brand-primary shadow-sm">
            <Text className="font-cairo text-[16px] font-bold text-white">
              {t('welcome.getStarted')}
            </Text>
          </Button>

          <Pressable
            onPress={() => router.push('/login')}
            className="h-[56px] w-full items-center justify-center rounded-full border-2 border-brand-primary bg-surface-surface active:bg-brand-primary-container">
            <Text className="font-cairo text-[16px] font-bold text-brand-primary">
              {t('welcome.alreadyHaveAccount')}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
