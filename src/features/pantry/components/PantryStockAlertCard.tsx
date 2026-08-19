import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertCircle, Search } from 'lucide-react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useTranslation } from 'react-i18next';

export interface ExpiringItem {
  name: string;
  expireDate?: string | null;
}

export interface PantryStockAlertCardProps {
  expiringItems: ExpiringItem[];
  onPressCheckDeals?: () => void;
}

export function PantryStockAlertCard({
  expiringItems,
  onPressCheckDeals,
}: PantryStockAlertCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation('pantry');

  if (!expiringItems || expiringItems.length === 0) {
    return null;
  }

  // Calculate days difference relative to today (ignoring time component)
  const getExpiryStatus = (expireDate: string | null | undefined) => {
    if (!expireDate) return '';
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const expiry = new Date(expireDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return t('stockAlert.statusExpired', 'Expired');
    }
    if (diffDays === 0) {
      return t('stockAlert.statusToday', 'Expires today');
    }
    return t('stockAlert.statusSoon', {
      defaultValue: 'Expiring Soon ({{days}}d)',
      days: diffDays,
    });
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.brand.accentContainer,
        borderColor: theme.colors.brand.accent,
      }}
      className="mx-spacing-16 mb-spacing-16 rounded-radius-large border p-spacing-16 shadow-sm">
      {/* Header Row: Title & Badge */}
      <View className="mb-spacing-16 flex-row items-center gap-spacing-8">
        <Text style={{ color: theme.colors.brand.error }} className="font-cairo text-xl font-bold">
          {t('stockAlert.title', 'Pantry Stock Alert')}
        </Text>

        {/* Count Badge */}
        <View
          style={{ backgroundColor: theme.colors.brand.accent }}
          className="py-spacing-2 rounded-radius-medium px-spacing-8">
          <Text className="font-cairo text-base font-bold text-text-primary">
            {t('stockAlert.itemCount', { count: expiringItems.length })}
          </Text>
        </View>
      </View>

      {/* Body: Warning Icon + Description & Items List */}
      <View className="mb-spacing-16 flex-row items-start gap-spacing-16">
        {/* Warning Icon Container */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.brand.accent,
          }}
          className="p-spacing-2 items-center justify-center">
          <AlertCircle size={22} color={theme.colors.text.primary} />
        </View>

        {/* Text Area */}
        <View className="flex-1">
          <Text className="mb-spacing-8 font-cairo text-sm font-bold leading-tight text-text-on-accent">
            {t(
              'stockAlert.description',
              'Hey! Items in your pantry are running out or expiring soon. Wanna check supermarket offers?'
            )}
          </Text>

          {/* Expiring Items inline list */}
          <Text className="text-bodySmall font-cairo leading-[20px] text-text-on-accent">
            {expiringItems.slice(0, 3).map((item, idx) => {
              const status = getExpiryStatus(item.expireDate);
              const isExpired = status === t('stockAlert.statusExpired', 'Expired');
              const statusColor = isExpired ? theme.colors.brand.error : theme.colors.brand.accent;
              return (
                <React.Fragment key={idx}>
                  <Text className="font-bold text-text-on-accent">{item.name}</Text>
                  <Text style={{ color: statusColor }} className="font-semibold">
                    {' '}
                    ({status})
                  </Text>
                  {idx < Math.min(expiringItems.length, 3) - 1 ? <Text>, </Text> : null}
                </React.Fragment>
              );
            })}
            {expiringItems.length > 3 ? (
              <Text className="font-bold text-text-on-accent">
                {' '}
                {t('stockAlert.more', { count: expiringItems.length - 3 })}
              </Text>
            ) : null}
          </Text>
        </View>
      </View>

      {/* Action Button: Check Supermarket Deals */}
      {onPressCheckDeals && (
        <Pressable
          onPress={onPressCheckDeals}
          accessibilityRole="button"
          accessibilityLabel={t('stockAlert.checkDeals', 'Check Supermarket Deals')}
          className="h-10 flex-row items-center justify-center gap-x-spacing-8 self-start rounded-radius-full bg-brand-primary px-spacing-16 shadow-sm active:bg-brand-primary-pressed">
          <Search size={20} color={'white'} />
          <Text className="px-spacing-8 font-cairo text-base font-bold text-white">
            {t('stockAlert.checkDeals', 'Check Supermarket Deals')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
