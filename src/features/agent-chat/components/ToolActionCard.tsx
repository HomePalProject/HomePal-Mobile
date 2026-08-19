import React, { useMemo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import {
  Sparkles,
  Check,
  CheckSquare,
  XCircle,
  CheckCircle,
  Calendar,
  Bot,
} from 'lucide-react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { ChatMessage } from '../types';
import { useTranslation } from 'react-i18next';

export interface ToolActionCardProps {
  message: ChatMessage;
  onApprove: (approved: boolean) => void;
}

interface ParsedItem {
  name?: string;
  itemName?: string;
  quantity?: string | number;
  unit?: string;
  amount?: string | number;
}

interface MealPlanDetails {
  title: string;
  startDate?: string;
  endDate?: string;
  mealsCount?: string | number;
}

export function ToolActionCard({ message, onApprove }: ToolActionCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation('agentChat');

  const isToolCall = message.role === 'tool_call';
  const isApproval = message.role === 'approval_request';

  const toolName = message.toolName || '';
  const isShoppingList =
    toolName === 'AddShoppingListItems' || toolName === 'AddItemsToShoppingList';
  const isMealPlan =
    toolName === 'SaveMealPlan' || toolName === 'CreateMealPlan' || toolName === 'SaveMeals';

  // Safely parse items array from the tool args (Shopping List Case)
  const items = useMemo<ParsedItem[]>(() => {
    if (!isShoppingList || !message.args) return [];
    try {
      let parsed = message.args;
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.items)) {
          return parsed.items;
        }
        if (parsed.name || parsed.itemName) {
          return [parsed];
        }
      }
    } catch (e) {
      console.warn('[ToolActionCard] Failed to parse shopping list items:', e);
    }
    return [];
  }, [message.args, isShoppingList]);

  // Safely parse meal plan details (Meal Plan Case)
  const mealPlan = useMemo<MealPlanDetails | null>(() => {
    if (!isMealPlan || !message.args) return null;
    try {
      let parsed = message.args;
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (parsed && typeof parsed === 'object') {
        return {
          title:
            parsed.title ||
            parsed.mealPlanName ||
            parsed.name ||
            t('chips.mealPlan', 'Weekly Meal Plan'),
          startDate: parsed.startDate || parsed.start || parsed.from || '',
          endDate: parsed.endDate || parsed.end || parsed.to || '',
          mealsCount: parsed.mealsCount || parsed.meals?.length || parsed.meals || '',
        };
      }
    } catch (e) {
      console.warn('[ToolActionCard] Failed to parse meal plan details:', e);
    }
    return null;
  }, [message.args, isMealPlan, t]);

  // Safely parse key-value pairs (Fallback Case)
  const fallbackDetails = useMemo(() => {
    if (isShoppingList || isMealPlan || !message.args) return [];
    try {
      let parsed = message.args;
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (parsed && typeof parsed === 'object') {
        return Object.entries(parsed).map(([key, val]) => ({
          key: key.replace(/([A-Z])/g, ' $1').trim(), // CamelCase to spaces
          value: typeof val === 'object' ? JSON.stringify(val) : String(val),
        }));
      }
    } catch (e) {
      console.warn('[ToolActionCard] Failed to parse fallback args:', e);
    }
    return [];
  }, [message.args, isShoppingList, isMealPlan]);

  if (isToolCall) {
    const isDone = message.status === 'done';
    return (
      <View className="mx-spacing-16 my-spacing-8 flex-row items-center gap-spacing-8 rounded-radius-medium border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
        <Bot size={16} color={theme.colors.brand.accent} />
        <Text className="text-caption flex-1 font-cairo font-semibold text-text-primary">
          {toolName === 'SearchOffers'
            ? t('tools.checkingOffers', 'Checking Carrefour and Spinneys...')
            : toolName === 'CheckPantry'
              ? t('tools.checkingPantry', 'Checking pantry ingredients...')
              : t('tools.executing', {
                  defaultValue: 'Executing {{name}}...',
                  name: toolName || t('tools.assistantTool', 'assistant tool'),
                })}
        </Text>
        {isDone ? (
          <CheckCircle size={16} color={theme.colors.brand.success} />
        ) : (
          <ActivityIndicator size="small" color={theme.colors.brand.primary} />
        )}
      </View>
    );
  }

  if (isApproval) {
    const isPending = message.status === 'pending';
    const isApproved = message.status === 'approved';
    const isRejected = message.status === 'rejected';

    // Configure headers and action texts dynamically based on tool type
    let cardTitle = t('tools.confirmationRequired', 'CONFIRMATION REQUIRED');
    let IconComponent = CheckSquare;
    let primaryButtonText = t('tools.approve', 'Approve');
    let approvalSuccessText = t('tools.approved', 'Approved');

    if (isShoppingList) {
      cardTitle = t('tools.addToShoppingList', 'ADD TO SHOPPING LIST');
      IconComponent = CheckSquare;
      primaryButtonText = t('tools.addToList', 'Add to List');
      approvalSuccessText = t('tools.addedToList', 'Added to List');
    } else if (isMealPlan) {
      cardTitle = t('tools.saveMealPlan', 'SAVE MEAL PLAN');
      IconComponent = Calendar;
      primaryButtonText = t('tools.saveMealPlanBtn', 'Save Meal Plan');
      approvalSuccessText = t('tools.mealPlanSaved', 'Meal Plan Saved');
    } else if (toolName) {
      cardTitle = toolName
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toUpperCase();
    }

    return (
      <View className="mx-spacing-16 my-spacing-8 rounded-radius-medium border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
        {/* Card Header */}
        <View className="flex-row items-center gap-spacing-8 border-b border-surface-divider pb-spacing-8">
          <IconComponent size={18} color={theme.colors.brand.primary} />
          <Text className="text-bodySmall font-cairo font-bold uppercase tracking-wider text-brand-primary">
            {cardTitle}
          </Text>
        </View>

        {/* Card Content Layouts */}
        {isShoppingList && (
          <View className="mt-spacing-12 gap-spacing-8">
            {items.length > 0 ? (
              items.map((item, idx) => {
                const name = item.name || item.itemName || 'Item';
                const qty = item.quantity || item.amount || item.unit || '';
                return (
                  <View key={idx} className="flex-row items-center justify-between py-spacing-4">
                    <View className="flex-1 flex-row items-center gap-spacing-8">
                      <Check size={14} color={theme.colors.brand.success} />
                      <Text className="text-bodySmall flex-1 font-cairo font-medium text-text-primary">
                        {name}
                      </Text>
                    </View>
                    {!!qty && (
                      <View className="bg-surface-surfaceVariant py-spacing-2 rounded-radius-small px-spacing-8">
                        <Text className="text-caption font-cairo text-text-secondary">{qty}</Text>
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <Text className="text-bodySmall mt-spacing-12 font-cairo text-text-secondary">
                {t('tools.noItems', 'No items details provided.')}
              </Text>
            )}
          </View>
        )}

        {isMealPlan && mealPlan && (
          <View className="mt-spacing-12 gap-spacing-8">
            <Text className="text-bodySmall font-cairo font-bold text-text-primary">
              {mealPlan.title}
            </Text>
            {!!mealPlan.startDate && (
              <View className="mt-spacing-4 flex-row items-center justify-between py-spacing-4">
                <Text className="text-caption font-cairo text-text-secondary">
                  {t('tools.startDate', 'Start Date')}
                </Text>
                <Text className="text-bodySmall font-cairo font-medium text-text-primary">
                  {mealPlan.startDate}
                </Text>
              </View>
            )}
            {!!mealPlan.endDate && (
              <View className="flex-row items-center justify-between py-spacing-4">
                <Text className="text-caption font-cairo text-text-secondary">
                  {t('tools.endDate', 'End Date')}
                </Text>
                <Text className="text-bodySmall font-cairo font-medium text-text-primary">
                  {mealPlan.endDate}
                </Text>
              </View>
            )}
            {!!mealPlan.mealsCount && (
              <View className="flex-row items-center justify-between py-spacing-4">
                <Text className="text-caption font-cairo text-text-secondary">
                  {t('tools.totalMeals', 'Total Meals')}
                </Text>
                <Text className="text-bodySmall font-cairo font-medium text-text-primary">
                  {mealPlan.mealsCount}
                </Text>
              </View>
            )}
          </View>
        )}

        {!isShoppingList && !isMealPlan && (
          <View className="mt-spacing-12 gap-spacing-8">
            {fallbackDetails.length > 0 ? (
              fallbackDetails.map((arg, idx) => (
                <View key={idx} className="flex-row items-center justify-between py-spacing-4">
                  <Text className="text-caption font-cairo capitalize text-text-secondary">
                    {arg.key}
                  </Text>
                  <Text className="text-bodySmall font-cairo font-medium text-text-primary">
                    {arg.value}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-bodySmall mt-spacing-12 font-cairo text-text-secondary">
                {typeof message.args === 'string'
                  ? message.args
                  : t('tools.pendingDetails', 'Confirmation details pending approval.')}
              </Text>
            )}
          </View>
        )}

        {/* Action Buttons / Status Footer */}
        {isPending && (
          <View className="mt-spacing-16 flex-row items-center justify-end gap-spacing-16">
            <Pressable
              onPress={() => onApprove(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancel request"
              className="px-spacing-12 py-spacing-8 active:opacity-75">
              <Text className="text-bodySmall font-cairo font-bold text-text-secondary">
                {t('tools.cancelBtn', 'Cancel')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onApprove(true)}
              accessibilityRole="button"
              accessibilityLabel={`Approve ${primaryButtonText.toLowerCase()}`}
              className="rounded-radius-full bg-brand-primary px-spacing-16 py-spacing-8 active:opacity-75">
              <Text className="text-bodySmall font-cairo font-bold text-text-inverse">
                {primaryButtonText}
              </Text>
            </Pressable>
          </View>
        )}

        {isApproved && (
          <View className="mt-spacing-16 flex-row items-center justify-end gap-spacing-8">
            <Check size={16} color={theme.colors.brand.success} />
            <Text className="text-bodySmall font-cairo font-bold text-brand-success">
              {approvalSuccessText}
            </Text>
          </View>
        )}

        {isRejected && (
          <View className="mt-spacing-16 flex-row items-center justify-end gap-spacing-8">
            <XCircle size={16} color={theme.colors.brand.error} />
            <Text className="text-bodySmall font-cairo font-bold text-brand-error">
              {t('tools.rejected', 'Rejected')}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return null;
}
