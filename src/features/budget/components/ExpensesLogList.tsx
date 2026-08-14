import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { useTheme } from '@/src/providers/ThemeProvider';
import { ExpenseResponse } from '@/src/services';

interface ExpensesLogListProps {
  expenses: ExpenseResponse[];
  onDeleteExpense: (id: string) => Promise<void>;
  isDeletingId?: string | null;
  isLoading?: boolean;
}

/**
 * Format currency amount safely without localizing differences crashing React Native.
 */
const formatCurrency = (amount: number) => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const fixed = absAmount.toFixed(2);
  const [integer, decimal] = fixed.split('.');
  // Add thousands separators to integer part
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${isNegative ? '-' : ''}EGP ${formattedInteger}.${decimal}`;
};

/**
 * Safe date formatting from ISO/API string to MM/DD/YYYY
 */
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    // Check if it has a T character or just YYYY-MM-DD
    const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parts = datePart.split('-');
    if (parts.length === 3) {
      const [yyyy, mm, dd] = parts;
      return `${mm}/${dd}/${yyyy}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
};

export function ExpensesLogList({
  expenses,
  onDeleteExpense,
  isDeletingId = null,
  isLoading = false,
}: ExpensesLogListProps) {
  const { theme } = useTheme();
  const itemCount = expenses.length;

  return (
    <View className="gap-spacing-16 rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
      {/* Header & Item Count Badge */}
      <View className="flex-row items-center justify-between">
        <Text className="font-cairo text-lg font-bold text-brand-primary">Expenses Log</Text>
        <View className="bg-surface-surfaceVariant rounded-radius-full border border-surface-border px-spacing-8 py-spacing-4">
          <Text className="text-caption font-cairo font-semibold text-text-secondary">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>

      <View className="h-[1px] bg-surface-divider" />

      {isLoading ? (
        <View className="items-center justify-center py-spacing-32">
          <ActivityIndicator size="large" color={theme.colors.brand.primary} />
        </View>
      ) : itemCount === 0 ? (
        /* Empty State */
        <View className="items-center justify-center py-spacing-32">
          <Text className="text-body text-center font-cairo font-medium text-text-secondary">
            No expenses recorded for this month yet.
          </Text>
        </View>
      ) : (
        /* Expenses list container */
        <View className="gap-spacing-8">
          {expenses.map((expense) => {
            const isDeleting = isDeletingId === expense.id;
            return (
              <View
                key={expense.id}
                className="flex-row items-center justify-between rounded-radius-large border border-surface-border p-spacing-16">
                <View className="flex-1 pr-spacing-16">
                  <Text className="text-body font-cairo font-bold text-text-primary">
                    {expense.title}
                  </Text>
                  <Text className="text-caption mt-spacing-4 font-cairo text-text-secondary">
                    {formatDate(expense.expenseDate)}
                  </Text>
                </View>

                <View className="flex-row items-center gap-spacing-16">
                  <Text className="text-body font-cairo font-bold text-brand-primary">
                    {formatCurrency(expense.amount)}
                  </Text>

                  <Pressable
                    onPress={() => onDeleteExpense(expense.id)}
                    disabled={isDeleting || isLoading}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete expense ${expense.title}`}
                    className="active:bg-surface-surfaceVariant h-10 w-10 items-center justify-center rounded-radius-full disabled:opacity-50">
                    {isDeleting ? (
                      <ActivityIndicator size="small" color={theme.colors.brand.error} />
                    ) : (
                      <Icon as={Trash2} size={18} className="text-brand-error" />
                    )}
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
