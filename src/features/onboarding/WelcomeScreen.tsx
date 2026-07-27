import React from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { Icon } from '@/src/components/ui/icon';
import { Home, Sparkles, Heart, ShieldCheck } from 'lucide-react-native';

export const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <View className="flex-1 justify-between px-6 pb-8 pt-4">
        {/* Top Navigation / Branding */}
        <View className="items-center py-2">
          <Text className="font-cairo text-[28px] font-bold tracking-tight text-brand-primary">
            HomePal
          </Text>
        </View>

        {/* Hero Image Container Placeholder */}
        <View className="my-4 items-center justify-center">
          <View className="h-[280px] w-full items-center justify-center overflow-hidden rounded-[32px] bg-brand-primary-container p-6 shadow-sm">
            {/* Decorative stylized illustration representing home management */}
            <View className="h-[120px] w-[120px] items-center justify-center rounded-full bg-brand-primary shadow-md">
              <Icon as={Home} size={64} className="text-white" />
            </View>
            <View className="absolute left-8 top-8 flex-row items-center gap-1.5 rounded-full border border-surface-border bg-surface-surface px-3 py-1.5 shadow-sm">
              <Icon as={Sparkles} size={14} className="text-brand-accent" />
              <Text className="font-cairo text-[12px] font-semibold text-text-primary">
                AI Meal Plans
              </Text>
            </View>
            <View className="absolute bottom-8 right-8 flex-row items-center gap-1.5 rounded-full border border-surface-border bg-surface-surface px-3 py-1.5 shadow-sm">
              <Icon as={ShieldCheck} size={14} className="text-brand-primary" />
              <Text className="font-cairo text-[12px] font-semibold text-text-primary">
                Budget Safe
              </Text>
            </View>
            <View className="absolute bottom-10 left-10 flex-row items-center gap-1.5 rounded-full border border-surface-border bg-surface-surface px-2.5 py-1 shadow-sm">
              <Icon as={Heart} size={12} className="text-brand-error" />
              <Text className="font-cairo text-[11px] font-semibold text-text-primary">Family</Text>
            </View>
          </View>
        </View>

        {/* Typography Section */}
        <View className="flex-col gap-3 px-2 text-center">
          <Text className="text-center font-cairo text-[28px] font-bold leading-[36px] text-brand-primary">
            Manage your home with ease.
          </Text>
          <Text className="text-center font-cairo text-[16px] leading-[24px] text-text-secondary">
            The calm way to handle groceries, meals, and budgets.
          </Text>
        </View>

        {/* Actions */}
        <View className="mt-4 flex-col gap-3">
          <Button
            onPress={() => router.push('/(auth)/register')}
            className="h-[56px] w-full rounded-full bg-brand-primary shadow-sm">
            <Text className="font-cairo text-[16px] font-bold text-white">Get started</Text>
          </Button>

          <Pressable
            onPress={() => router.push('/(auth)/login')}
            className="h-[56px] w-full items-center justify-center rounded-full border-2 border-brand-primary bg-surface-surface active:bg-brand-primary-container">
            <Text className="font-cairo text-[16px] font-bold text-brand-primary">
              I already have an account
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
