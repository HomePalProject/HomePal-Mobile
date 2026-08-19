import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { PaymentTransactionResponse, PaymentStatus } from '@/src/types/api';
import { useTranslation } from 'react-i18next';

interface PaymentHistoryListProps {
  history: PaymentTransactionResponse[];
}

export const PaymentHistoryList: React.FC<PaymentHistoryListProps> = ({ history }) => {
  const { t } = useTranslation();

  const renderItem = ({ item }: { item: PaymentTransactionResponse }) => {
    const isSuccess = item.status === PaymentStatus.Success;

    return (
      <View className="flex-row items-center justify-between py-2">
        <View>
          <Text className="text-bodySmall font-cairo font-bold text-text-primary">
            {item.amount} {item.currency}
          </Text>
          <Text className="text-labelSmall mt-1 font-cairo text-text-secondary">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View
          className={`rounded-[12px] px-2 py-1 ${isSuccess ? 'bg-status-success/10' : 'bg-surface-surfaceVariant'}`}>
          <Text
            className={`text-labelSmall font-cairo font-bold ${isSuccess ? 'text-status-success' : 'text-text-secondary'}`}>
            {isSuccess
              ? t('subscriptions.success', 'Success')
              : t('subscriptions.pending', 'Pending/Failed')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="mb-5 rounded-radius-large border border-surface-border bg-surface-surface p-5 shadow-sm">
      <View className="mb-4 border-b border-surface-divider pb-3">
        <Text className="text-bodyLarge font-cairo font-bold text-brand-primary">
          {t('subscriptions.paymentHistory', 'Payment & Invoices History')}
        </Text>
      </View>

      {history.length === 0 ? (
        <View className="items-center p-5">
          <Text className="text-bodySmall font-cairo text-text-secondary">
            {t('subscriptions.noPayments', 'No previous payments found.')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="my-1 h-px bg-surface-border" />}
        />
      )}
    </View>
  );
};
