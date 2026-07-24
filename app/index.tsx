import { Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { TestTheme } from '@/src/features/test/TestTheme';
export default function Screen() {
  return (
    // <>
    //   <Stack.Screen options={{ title: 'HomePal' }} />
    //   <View className="flex-1 items-center justify-center bg-background p-6">
    //     <Text variant="h1" className="text-foreground">
    //       HomePal
    //     </Text>
    //     <Text className="mt-4 text-center text-muted-foreground">
    //       Project architecture scaffold is ready.
    //     </Text>
    //   </View>
    // </>
    <TestTheme />
  );
}
