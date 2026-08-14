import { useEffect } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator, useColorScheme } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { ArrowLeft } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';
import { lightColors, darkColors } from '@/src/theme/colors';

import { useAppDispatch, useAppSelector } from '@/src/store';
import { fetchMealPlanById, clearMealPlanDetails } from '@/src/store/slices/mealPlansSlice';
import { useTheme } from '@/src/hooks/useTheme';

export default function MealPlanDetailsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentPlanDetails, isLoadingDetails, error } = useAppSelector(
    (state) => state.mealPlans
  );
  const { theme } = useTheme();

  useEffect(() => {
    if (id) {
      dispatch(fetchMealPlanById(id));
    }
    return () => {
      dispatch(clearMealPlanDetails());
    };
  }, [id, dispatch]);

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Meal Plan Details',
          headerTitleStyle: { fontFamily: 'Cairo', fontWeight: 'bold' },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.back();
              }}
              hitSlop={10}
              className="overflow-hidden rounded-full"
              android_ripple={{ color: 'rgba(150, 150, 150, 0.2)', borderless: true, radius: 24 }}>
              <Icon as={ArrowLeft} size={24} className="mr-4 text-text-primary" />
            </Pressable>
          ),
        }}
      />

      {isLoadingDetails ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00696E" />
          <Text className="mt-4 font-cairo text-sm text-text-secondary">Loading details...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-error-primary text-center font-cairo text-base font-bold">
            {error}
          </Text>
        </View>
      ) : currentPlanDetails ? (
        <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 40 }}>
          <Text className="font-cairo text-2xl font-bold text-brand-primary">
            {currentPlanDetails.title}
          </Text>

          <View className="mt-2 flex-row flex-wrap items-center gap-2">
            <Text className="font-cairo text-sm font-semibold text-text-primary">
              {new Date(currentPlanDetails.startDate).toLocaleDateString()} -{' '}
              {new Date(currentPlanDetails.endDate).toLocaleDateString()}
            </Text>
            <Text className="font-cairo text-sm font-bold text-text-primary">•</Text>
            <Text className="font-cairo text-sm font-bold text-brand-accent">
              Est. Cost: EGP {currentPlanDetails.totalEstimatedCost?.toFixed(2) || '0.00'}
            </Text>
          </View>

          <View className="mt-6 rounded-2xl border border-surface-border bg-surface-surface-variant p-4">
            <Markdown
              style={{
                body: {
                  fontFamily: 'Cairo',
                  color: theme.colors.text.primary,
                  fontSize: 16,
                  textAlign: 'right',
                  writingDirection: 'rtl',
                },
                heading1: {
                  fontFamily: 'Cairo',
                  fontWeight: 'bold',
                  color: theme.colors.brand.primary,
                  marginTop: 10,
                  marginBottom: 10,
                  textAlign: 'right',
                },
                heading2: {
                  fontFamily: 'Cairo',
                  fontWeight: 'bold',
                  color: theme.colors.brand.primary,
                  marginTop: 10,
                  marginBottom: 10,
                  textAlign: 'right',
                },
                heading3: {
                  fontFamily: 'Cairo',
                  fontWeight: 'bold',
                  color: theme.colors.brand.primary,
                  marginTop: 10,
                  marginBottom: 10,
                  textAlign: 'right',
                },
                paragraph: {
                  marginBottom: 10,
                  lineHeight: 24,
                  textAlign: 'right',
                  color: theme.colors.text.primary,
                },
                list_item: {
                  marginBottom: 5,
                  flexDirection: 'row-reverse',
                  color: theme.colors.text.primary,
                },
                bullet_list: { textAlign: 'right', color: theme.colors.text.primary },
                ordered_list: { textAlign: 'right', color: theme.colors.text.primary },
              }}>
              {currentPlanDetails.planData || 'No meal plan content available.'}
            </Markdown>
          </View>

          <View className="mb-4 mt-8">
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.back();
              }}
              className="border-surface-outline overflow-hidden rounded-full border bg-surface-background py-3 dark:border-text-secondary"
              android_ripple={{ color: 'rgba(150, 150, 150, 0.2)' }}>
              <Text className="text-center font-cairo text-base font-bold text-brand-primary">
                Close
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="font-cairo text-base font-semibold text-text-secondary">
            Meal plan not found.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
