import { View, Text } from 'react-native';

export function TestTheme() {
  return (
    <View className="flex-1 items-center justify-center bg-surface-background p-spacing-24">
      <View className="w-full rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16">
        <Text className="font-cairo text-2xl font-bold text-text-primary">HomePal</Text>

        <Text className="mt-spacing-8 font-cairo text-text-primary">Theme is working</Text>

        <View className="mt-spacing-16 rounded-radius-medium bg-brand-primary p-spacing-16">
          <Text className="font-cairo text-text-inverse">Primary Button</Text>
        </View>

        <View className="mt-spacing-8 rounded-radius-medium bg-brand-accent p-spacing-16">
          <Text className="font-cairo text-text-primary">Accent Button</Text>
        </View>
      </View>
    </View>
  );
}
