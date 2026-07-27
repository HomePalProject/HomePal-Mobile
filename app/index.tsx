import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { Home } from 'lucide-react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-surface-background">
      <View className="flex-col items-center gap-4">
        {/* Stylized Logo Mark */}
        <View className="h-[80px] w-[80px] items-center justify-center rounded-[24px] bg-brand-primary shadow-lg">
          <Icon as={Home} size={48} className="text-white" />
        </View>
        <Text className="font-cairo text-[32px] font-bold tracking-tight text-brand-primary">
          HomePal
        </Text>
      </View>
    </View>
  );
}
