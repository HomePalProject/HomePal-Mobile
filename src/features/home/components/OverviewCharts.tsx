import React from 'react';
import { View } from 'react-native';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { Text } from '@/src/components/ui/text';
import { useTheme } from '@/src/providers/ThemeProvider';
import { HouseholdOverviewReportDto, LocalizedItem } from '../../overview/types';
import { useTranslation } from 'react-i18next';

interface OverviewChartsProps {
  data?: HouseholdOverviewReportDto;
}

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formatCurrency = (value: number | string | undefined, t: any) => {
  const currencyUnit = t('active.kpis.currency', 'EGP');
  if (value === undefined || value === null) return `0 ${currencyUnit}`;
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) return String(value) + ` ${currencyUnit}`;
  const fixed = num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
  const [integer, decimal] = fixed.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${formattedInteger}${decimal ? '.' + decimal : ''} ${currencyUnit}`;
};

const getCategoryName = (categoryName?: LocalizedItem[], currentLanguage?: string, t?: any) => {
  const fallback = t ? t('active.charts.other', 'Other') : 'Other';
  if (!categoryName || categoryName.length === 0) return fallback;
  const matchedItem = categoryName.find((item) =>
    item.culture?.toLowerCase().startsWith(currentLanguage || 'en')
  );
  if (matchedItem) return matchedItem.value;
  const engItem = categoryName.find((item) => item.culture?.toLowerCase().startsWith('en'));
  return engItem?.value || categoryName[0]?.value || fallback;
};

export function OverviewCharts({ data }: OverviewChartsProps) {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation('home');
  const currentLanguage = i18n.language || 'en';

  const monthsShort = [
    t('active.charts.months.jan', 'Jan'),
    t('active.charts.months.feb', 'Feb'),
    t('active.charts.months.mar', 'Mar'),
    t('active.charts.months.apr', 'Apr'),
    t('active.charts.months.may', 'May'),
    t('active.charts.months.jun', 'Jun'),
    t('active.charts.months.jul', 'Jul'),
    t('active.charts.months.aug', 'Aug'),
    t('active.charts.months.sep', 'Sep'),
    t('active.charts.months.oct', 'Oct'),
    t('active.charts.months.nov', 'Nov'),
    t('active.charts.months.dec', 'Dec'),
  ];

  const expensesOverTime = data?.expensesOverTime || [];
  const inventoryDistribution = data?.inventoryDistribution;
  const budgetOverview = data?.budgetOverview;

  // 1. Expenses Line Chart Data
  const sortedExpenses = [...expensesOverTime].sort((a, b) => {
    const yA = typeof a.year === 'number' ? a.year : parseInt(a.year || '0', 10);
    const yB = typeof b.year === 'number' ? b.year : parseInt(b.year || '0', 10);
    const mA = typeof a.month === 'number' ? a.month : parseInt(a.month || '0', 10);
    const mB = typeof b.month === 'number' ? b.month : parseInt(b.month || '0', 10);
    return yA - yB || mA - mB;
  });

  const lineData = sortedExpenses.map((item) => {
    const val = typeof item.amount === 'number' ? item.amount : parseFloat(item.amount || '0');
    const m = typeof item.month === 'number' ? item.month : parseInt(item.month || '1', 10);
    return {
      value: val,
      label: monthsShort[m - 1] || '',
    };
  });

  // 2. Inventory Donut Chart Data
  const palette = [
    theme.colors.brand.primary,
    theme.colors.brand.accent,
    theme.colors.brand.info || '#4F8EF7',
    theme.colors.brand.success || '#43A66F',
    theme.colors.brand.warning || '#E6A33A',
    '#9cd1bf',
  ];

  const categoriesData = inventoryDistribution?.categories || [];
  const totalItems =
    typeof inventoryDistribution?.totalItems === 'number'
      ? inventoryDistribution.totalItems
      : parseInt(inventoryDistribution?.totalItems || '0', 10);

  const inventoryPieData = categoriesData.map((item, index) => {
    const val = typeof item.count === 'number' ? item.count : parseInt(item.count || '0', 10);
    return {
      value: val,
      color: palette[index % palette.length],
      label: getCategoryName(item.categoryName, currentLanguage, t),
    };
  });

  // 3. Budget Donut Chart Data
  const target =
    typeof budgetOverview?.monthlyTarget === 'number'
      ? budgetOverview.monthlyTarget
      : parseFloat(budgetOverview?.monthlyTarget || '0');
  const spent =
    typeof budgetOverview?.totalSpent === 'number'
      ? budgetOverview.totalSpent
      : parseFloat(budgetOverview?.totalSpent || '0');
  const remaining =
    typeof budgetOverview?.remaining === 'number'
      ? budgetOverview.remaining
      : parseFloat(budgetOverview?.remaining || '0');

  const spentPct = target > 0 ? Math.round((spent / target) * 100) : 0;
  const isOverrun = spent > target;

  const budgetPieData = [
    {
      value: spent,
      color: isOverrun ? theme.colors.brand.error : theme.colors.brand.primary,
    },
    ...(remaining > 0
      ? [
          {
            value: remaining,
            color: theme.colors.surface.divider,
          },
        ]
      : []),
  ];

  return (
    <View className="gap-y-spacing-24">
      {/* ── Expenses Over Time Card ── */}
      <View className="rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
        <View className="mb-spacing-12 flex-row items-center justify-between">
          <View className="flex-1 pr-spacing-8">
            <Text className="font-cairo text-base font-bold text-text-primary">
              {t('active.charts.expensesOverTime', 'Expenses Over Time')}
            </Text>
            <Text className="font-cairo text-[12px] text-text-secondary">
              {t(
                'active.charts.expensesSubtitle',
                'Track household spending over the last 6 months.'
              )}
            </Text>
          </View>
          <View className="bg-surface-surfaceVariant rounded-radius-full border border-surface-border px-spacing-8 py-spacing-4">
            <Text className="font-cairo text-[11px] font-semibold text-text-secondary">
              {t('active.charts.last6months', 'Last 6 months')}
            </Text>
          </View>
        </View>

        {lineData.length > 0 ? (
          <View className="items-center justify-center pr-spacing-16 pt-spacing-16">
            <LineChart
              data={lineData}
              color={theme.colors.brand.primary}
              thickness={3}
              curved
              hideRules
              areaChart
              startFillColor={theme.colors.brand.primary}
              endFillColor={theme.colors.surface.surface}
              startOpacity={0.3}
              endOpacity={0.01}
              noOfSections={3}
              yAxisColor="transparent"
              xAxisColor={theme.colors.surface.border}
              yAxisTextStyle={{
                color: theme.colors.text.secondary,
                fontSize: 10,
                fontFamily: 'Cairo-Regular',
              }}
              xAxisLabelTextStyle={{
                color: theme.colors.text.secondary,
                fontSize: 10,
                fontFamily: 'Cairo-Regular',
              }}
              width={260}
              height={140}
            />
          </View>
        ) : (
          <View className="h-32 items-center justify-center">
            <Text className="font-cairo text-sm text-text-disabled">
              {t('active.charts.noData', 'No historical data available')}
            </Text>
          </View>
        )}
      </View>

      {/* ── Inventory Distribution Card ── */}
      <View className="rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
        <View className="mb-spacing-12 flex-row items-center justify-between">
          <View className="flex-1 pr-spacing-8">
            <Text className="font-cairo text-base font-bold text-text-primary">
              {t('active.charts.inventoryDistribution', 'Inventory Distribution')}
            </Text>
            <Text className="font-cairo text-[12px] text-text-secondary">
              {t('active.charts.inventorySubtitle', 'Distribution of inventory items by category.')}
            </Text>
          </View>
          <View className="bg-surface-surfaceVariant rounded-radius-full border border-surface-border px-spacing-8 py-spacing-4">
            <Text className="font-cairo text-[11px] font-semibold text-text-secondary">
              {t('active.charts.itemCount', { count: totalItems })}
            </Text>
          </View>
        </View>

        {inventoryPieData.length > 0 ? (
          <View className="flex-row items-center justify-around py-spacing-8">
            <View className="relative items-center justify-center">
              <PieChart
                data={inventoryPieData}
                donut
                radius={60}
                innerRadius={42}
                innerCircleColor={theme.colors.surface.surface}
              />
              <View className="absolute items-center justify-center">
                <Text className="font-cairo text-lg font-bold text-brand-primary">
                  {totalItems}
                </Text>
                <Text className="font-cairo text-[10px] leading-[12px] text-text-disabled">
                  {t('active.charts.itemsLabel', 'items')}
                </Text>
              </View>
            </View>

            {/* Legend list */}
            <View className="max-w-[150px] gap-y-spacing-8">
              {inventoryPieData.map((item, index) => (
                <View key={index} className="flex-row items-center gap-x-spacing-8">
                  <View className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <Text
                    className="flex-1 font-cairo text-[12px] font-semibold text-text-primary"
                    numberOfLines={1}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className="h-32 items-center justify-center">
            <Text className="font-cairo text-sm text-text-disabled">
              {t('active.charts.noInventory', 'No items in inventory')}
            </Text>
          </View>
        )}
      </View>

      {/* ── Budget Overview Card ── */}
      <View className="rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
        <View className="mb-spacing-12 flex-row items-center justify-between">
          <View className="flex-1 pr-spacing-8">
            <Text className="font-cairo text-base font-bold text-text-primary">
              {t('active.charts.budgetOverview', 'Budget Overview')}
            </Text>
            <Text className="font-cairo text-[12px] text-text-secondary">
              {t(
                'active.charts.budgetSubtitle',
                'See how much of your monthly budget has been spent.'
              )}
            </Text>
          </View>
          <View className="bg-surface-surfaceVariant rounded-radius-full border border-surface-border px-spacing-8 py-spacing-4">
            <Text className="font-cairo text-[11px] font-semibold text-text-secondary">
              {t('active.charts.currentMonth', 'Current Month')}
            </Text>
          </View>
        </View>

        <View className="items-center justify-center py-spacing-16">
          <View className="relative items-center justify-center">
            <PieChart
              data={budgetPieData}
              donut
              radius={60}
              innerRadius={42}
              innerCircleColor={theme.colors.surface.surface}
            />
            <View className="absolute items-center justify-center">
              <Text
                className={[
                  'font-cairo text-lg font-bold',
                  isOverrun ? 'text-brand-error' : 'text-brand-primary',
                ]
                  .filter(Boolean)
                  .join(' ')}>
                {spentPct}%
              </Text>
              <Text className="font-cairo text-[10px] leading-[12px] text-text-disabled">
                {t('active.charts.spentLabel', 'Spent')}
              </Text>
            </View>
          </View>
        </View>

        {/* Budget Details Table */}
        <View className="pt-spacing-12 mt-spacing-8 gap-y-spacing-8 border-t border-surface-divider">
          <View className="flex-row items-center justify-between">
            <Text className="font-cairo text-sm text-text-secondary">
              {t('active.charts.monthlyBudgetTable', 'Monthly Budget')}
            </Text>
            <Text className="font-cairo text-sm font-bold text-text-primary">
              {formatCurrency(target, t)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="font-cairo text-sm text-text-secondary">
              {t('active.charts.spentTable', 'Spent')}
            </Text>
            <Text
              className={[
                'font-cairo text-sm font-bold',
                isOverrun ? 'text-brand-error' : 'text-text-primary',
              ]
                .filter(Boolean)
                .join(' ')}>
              {formatCurrency(spent, t)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="font-cairo text-sm text-text-secondary">
              {t('active.charts.remainingTable', 'Remaining')}
            </Text>
            <Text
              className={[
                'font-cairo text-sm font-bold',
                isOverrun ? 'text-brand-error' : 'text-text-primary',
              ]
                .filter(Boolean)
                .join(' ')}>
              {formatCurrency(remaining, t)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
