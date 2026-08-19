import { TabHeader } from '@/src/components/navigation/TabHeader';
import { Text } from '@/src/components/ui/text';
import * as Haptics from 'expo-haptics';
import { Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '@/src/store';
import {
  deleteMealPlan,
  fetchLatestMealPlan,
  fetchMealPlansHistory,
} from '@/src/store/slices/mealPlansSlice';
import { useTranslation } from 'react-i18next';

import { DeleteConfirmationModal } from '@/src/features/meals/components/DeleteConfirmationModal';
import { LatestMealPlanCard } from '@/src/features/meals/components/LatestMealPlanCard';
import { MealPlanHistoryCard } from '@/src/features/meals/components/MealPlanHistoryCard';

export default function MealsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('meals');

  const { latestPlan, historyPlans, isLoadingLatest, isLoadingHistory, isDeleting, pagination } =
    useAppSelector((state) => state.mealPlans);

  const isManager = useAppSelector((state) => state.profile.isManager);

  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  const loadData = async () => {
    dispatch(fetchLatestMealPlan());
    dispatch(fetchMealPlansHistory({ page: 1 }));
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchLatestMealPlan()),
      dispatch(fetchMealPlansHistory({ page: pagination.pageNumber })),
    ]);
    setRefreshing(false);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(fetchMealPlansHistory({ page: newPage }));
  };

  const handleViewDetails = (planId: string) => {
    router.push({
      pathname: '/(households)/meal-plan-details',
      params: { id: planId },
    });
  };

  const confirmDelete = (planId: string) => {
    setPlanToDelete(planId);
    setDeleteModalVisible(true);
  };

  const executeDelete = async () => {
    if (planToDelete) {
      await dispatch(deleteMealPlan(planToDelete));
      setDeleteModalVisible(false);
      setPlanToDelete(null);
      // Reload history to adjust pagination properly if a plan was removed
      dispatch(fetchMealPlansHistory({ page: pagination.pageNumber }));
      dispatch(fetchLatestMealPlan());
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['left', 'right']}>
      <TabHeader title={t('tabTitle')} />

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        scrollEventThrottle={400}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
          if (isCloseToBottom && pagination.hasNextPage && !isLoadingHistory) {
            dispatch(fetchMealPlansHistory({ page: pagination.pageNumber + 1 }));
          }
        }}>
        <LatestMealPlanCard
          plan={latestPlan}
          isLoading={isLoadingLatest || refreshing}
          onRefresh={onRefresh}
          onViewDetails={handleViewDetails}
        />

        <View className="mb-8 rounded-2xl border border-surface-border bg-surface-background p-4 shadow-sm dark:border-text-secondary">
          <View className="mb-4 flex-row items-center justify-between px-1">
            <Text className="font-cairo text-lg font-bold text-brand-primary">
              {t('historyTitle')}
            </Text>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                dispatch(fetchMealPlansHistory({ page: 1 }));
              }}
              disabled={isLoadingHistory}
              className={`rounded-full bg-brand-amber-300 px-4 py-1.5 ${isLoadingHistory ? 'opacity-50' : ''}`}>
              <Text className="font-cairo text-sm font-bold text-text-primary">{t('refresh')}</Text>
            </Pressable>
          </View>

          {historyPlans.length > 0 ? (
            <View>
              {historyPlans.map((plan) => (
                <MealPlanHistoryCard
                  key={plan.id}
                  plan={plan}
                  onViewDetails={handleViewDetails}
                  onDelete={confirmDelete}
                  canDelete={isManager}
                />
              ))}
            </View>
          ) : (
            <View className="py-8">
              <Text className="text-center font-cairo text-base font-semibold text-text-secondary">
                {t('noHistory')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        isDeleting={isDeleting}
        onCancel={() => {
          setDeleteModalVisible(false);
          setPlanToDelete(null);
        }}
        onConfirm={executeDelete}
      />
    </SafeAreaView>
  );
}
