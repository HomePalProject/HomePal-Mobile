import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/src/providers/ThemeProvider';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { useAppDispatch } from '@/src/store';
import { openDrawer } from '@/src/store/slices/uiSlice';
import { useBudget } from '@/src/features/budget/hooks/useBudget';
import {
  MonthSelector,
  BudgetSummaryCards,
  SetTargetModal,
  AddExpenseForm,
  ExpensesLogList,
} from '@/src/features/budget/components';

export default function BudgetScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    summary,
    expenses,
    isLoading,
    error,
    setTargetLoading,
    createExpenseLoading,
    getSummary,
    setTarget,
    getExpensesList,
    addExpense,
    removeExpense,
    clearError,
  } = useBudget();

  const fetchBudgetAndExpenses = async (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    await Promise.all([
      getSummary(year, month).catch(() => {}),
      getExpensesList(year, month).catch(() => {}),
    ]);
  };

  useEffect(() => {
    fetchBudgetAndExpenses(selectedDate);
  }, [selectedDate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBudgetAndExpenses(selectedDate);
    setRefreshing(false);
  };

  const handleSetTarget = async (targetAmount: number, notes: string | null) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    await setTarget({
      year,
      month,
      targetAmount,
      notes,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    await fetchBudgetAndExpenses(selectedDate);
  };

  const handleAddExpense = async (title: string, amount: number, date: string) => {
    await addExpense({
      title,
      amount,
      expenseDate: date,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    await fetchBudgetAndExpenses(selectedDate);
  };

  const handleDeleteExpense = async (id: string) => {
    setDeletingId(id);
    try {
      await removeExpense(id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch (err) {
      // Error handled by Redux state
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: () => clearError() }]);
    }
  }, [error, clearError]);

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={['bottom', 'left', 'right']}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between border-b border-surface-divider bg-surface-surface px-5 pb-3 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) + 12 }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => dispatch(openDrawer())}
            className="rounded-full p-1.5 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="Open Navigation Drawer">
            <Icon as={Menu} size={24} className="text-brand-primary" />
          </Pressable>
          <Text className="text-bodyLarge font-cairo font-bold text-brand-primary">HomePal</Text>
        </View>
      </View>

      {/* Content Scroll */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          className="flex-1 px-spacing-16 py-spacing-16"
          contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.brand.primary]}
            />
          }>
          <MonthSelector
            currentDate={selectedDate}
            onChangeDate={setSelectedDate}
            isLoading={isLoading}
          />

          <BudgetSummaryCards
            targetAmount={summary?.budgetAmount || 0}
            totalSpent={summary?.totalSpent || 0}
            remainingAmount={summary?.remainingAmount || 0}
            onSetTargetPress={() => setTargetModalVisible(true)}
            isLoading={isLoading}
          />

          <AddExpenseForm onAddExpense={handleAddExpense} isLoading={createExpenseLoading} />

          <ExpensesLogList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            isDeletingId={deletingId}
            isLoading={isLoading && !refreshing}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <SetTargetModal
        visible={targetModalVisible}
        onClose={() => setTargetModalVisible(false)}
        onSave={handleSetTarget}
        initialAmount={summary?.budgetAmount || 0}
        initialNotes={summary?.notes}
        isLoading={setTargetLoading}
      />
    </SafeAreaView>
  );
}
