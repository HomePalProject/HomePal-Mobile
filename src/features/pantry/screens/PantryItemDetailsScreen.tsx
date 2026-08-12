import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Calendar,
  Box,
  Clock,
  History,
  Trash2,
  Check,
  AlertTriangle,
  Minus,
  Plus,
  Package,
} from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { usePantry } from '../hooks/usePantry';
import { env } from '@/src/config/env';
import { getCategoryIconConfig } from '../components/CategorySelectorSheet';
import {
  PantryItemDetailsHeader,
  DeleteConfirmationModal,
  PantryNotificationModal,
} from '../components';
import { PantryItemResponse } from '@/src/types/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const resolveImageUrl = (path?: string | null): string | null => {
  if (!path) return null;
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('file://') ||
    path.startsWith('data:')
  ) {
    return path;
  }
  const baseUrl = env.API_BASE_URL.endsWith('/') ? env.API_BASE_URL : `${env.API_BASE_URL}/`;
  const relativePath = path.startsWith('/') ? path.substring(1) : path;
  return `${baseUrl}${relativePath}`;
};

const formatPrettyDate = (dateStr?: string | null): string => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = [
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
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
};

// ─── Screen Component ──────────────────────────────────────────────────────────

export default function PantryItemDetailsScreen() {
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();

  const {
    items,
    categories,
    measuringUnits,
    editItem,
    removeItem,
    isLoading: isPantryLoading,
  } = usePantry();

  const item = items.find((i) => i.id === itemId);
  const category = categories.find((c) => c.id === item?.categoryId);
  const unit = measuringUnits.find((u) => u.id === item?.measuringUnitId);

  // Stepper Loading state
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });

  // If item doesn't exist, we pop back
  useEffect(() => {
    if (!item && !isPantryLoading) {
      router.back();
    }
  }, [item, isPantryLoading]);

  if (!item) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface-background">
        <ActivityIndicator size="large" color="#356859" />
      </SafeAreaView>
    );
  }

  const imageUrl = resolveImageUrl(category?.imagePath);
  const unitLabel = unit?.symbol || unit?.name || '';

  // Determine freshness or low stock status
  const getStatusBadge = () => {
    if (item.quantity <= 1) {
      return { label: 'Low Stock', isWarning: true };
    }
    if (item.expireDate) {
      const expDate = new Date(item.expireDate);
      const now = new Date();
      const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 3) {
        return { label: 'Expiring soon', isWarning: true };
      }
    }
    return { label: 'In Stock', isWarning: false };
  };

  const status = getStatusBadge();
  const catIconConfig = getCategoryIconConfig(category?.name || '');

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleUpdateQuantity = async (newQty: number) => {
    if (newQty < 0 || isUpdating) return;
    setIsUpdating(true);
    try {
      await editItem(item.id, {
        name: item.name,
        quantity: newQty,
        measuringUnitId: item.measuringUnitId,
        categoryId: item.categoryId,
        expireDate: item.expireDate,
      });
    } catch {
      setNotification({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to update quantity.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await removeItem(item.id);
      setDeleteVisible(false);
      router.replace('/pantry');
    } catch {
      setNotification({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to remove item.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-surface">
      <StatusBar style="dark" />

      {/* Header */}
      <PantryItemDetailsHeader
        onBackPress={() => router.back()}
        onEditPress={() =>
          router.push({
            pathname: '/add-pantry-item',
            params: { itemId: item.id },
          })
        }
      />

      {/* Content Area */}
      <ScrollView
        className="flex-1 bg-surface-background"
        contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        {/* Large Image Card wrapper */}
        <View className="bg-surface-surfaceVariant h-48 w-full overflow-hidden rounded-radius-large border border-surface-border shadow-sm">
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} className="h-full w-full" resizeMode="cover" />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Icon as={Package} size={48} className="text-text-disabled" />
            </View>
          )}
        </View>

        {/* Item Header Info */}
        <View className="gap-spacing-16">
          <Text className="font-cairo text-lg font-bold text-text-primary">{item.name}</Text>

          {/* Badges Row */}
          <View className="flex-row gap-spacing-8">
            {/* Status Badge */}
            {status.isWarning ? (
              <View className="bg-surface-surfaceVariant flex-row items-center gap-spacing-4 rounded-radius-full border border-surface-border px-spacing-16 py-1">
                <Icon as={AlertTriangle} size={12} className="text-status-error" />
                <Text className="font-cairo text-base font-bold text-status-error">
                  {status.label}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-spacing-4 rounded-radius-full bg-brand-primary-container px-spacing-16 py-1">
                <Icon as={Check} size={12} className="text-brand-primary" />
                <Text className="font-cairo text-base font-bold text-brand-primary">
                  {status.label}
                </Text>
              </View>
            )}

            {/* Category Badge */}
            <View className="bg-surface-surfaceVariant flex-row items-center gap-spacing-4 rounded-radius-full border border-surface-border px-spacing-16 py-1">
              <Icon as={catIconConfig.icon} size={12} className="text-text-secondary" />
              <Text className="font-cairo text-base font-bold text-text-secondary">
                {category?.name || 'Staple'}
              </Text>
            </View>
          </View>
        </View>

        {/* Unified Card Details List */}
        <View className="gap-spacing-16 rounded-[20px] border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
          {/* Interactive Stepper Details Row */}
          <View className="border-surface-border/50 flex-row items-center justify-between border-b pb-spacing-16">
            <Text className="font-cairo text-lg font-bold text-text-primary">Quantity</Text>

            {/* Stepper controls */}
            <View className="bg-surface-surfaceVariant px-spacing-12 my-2 flex-row items-center gap-spacing-16 rounded-radius-full border border-surface-border px-2 py-1.5">
              <Pressable
                onPress={() => handleUpdateQuantity(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 0}
                className="h-7 w-7 items-center justify-center rounded-radius-full bg-brand-primary active:opacity-60">
                <Icon as={Minus} size={14} className="text-text-inverse" />
              </Pressable>

              {isUpdating ? (
                <ActivityIndicator size="small" color="#356859" className="w-[60px]" />
              ) : (
                <Text className="min-w-[60px] text-center font-cairo text-base font-bold text-text-primary">
                  {item.quantity} {unitLabel}
                </Text>
              )}

              <Pressable
                onPress={() => handleUpdateQuantity(item.quantity + 1)}
                disabled={isUpdating}
                className="h-7 w-7 items-center justify-center rounded-radius-full bg-brand-primary active:opacity-60">
                <Icon as={Plus} size={14} className="text-text-inverse" />
              </Pressable>
            </View>
          </View>

          {/* Expiry Date Row */}
          <View className="gap-spacing-12 flex-row items-center">
            <View className="bg-brand-amber-100/55 h-10 w-10 items-center justify-center rounded-radius-full">
              <Icon as={Calendar} size={18} className="text-brand-amber-500" />
            </View>
            <View className="flex-1">
              <Text className="text-caption font-cairo text-text-secondary">Expiry Date</Text>
              <Text
                className={`text-body font-cairo font-bold ${
                  status.isWarning && item.expireDate ? 'text-status-error' : 'text-text-primary'
                }`}>
                {formatPrettyDate(item.expireDate)}
              </Text>
            </View>
          </View>

          {/* Category Row */}
          <View className="gap-spacing-12 flex-row items-center">
            <View className="bg-brand-purple-100/55 h-10 w-10 items-center justify-center rounded-radius-full">
              <Icon as={Box} size={18} className="text-brand-purple-500" />
            </View>
            <View className="flex-1">
              <Text className="text-caption font-cairo text-text-secondary">Category</Text>
              <Text className="text-body font-cairo font-bold text-text-primary">
                {category?.name || 'Unassigned'}
              </Text>
            </View>
          </View>

          {/* Added On Row */}
          <View className="gap-spacing-12 flex-row items-center">
            <View className="bg-brand-blue-100/55 h-10 w-10 items-center justify-center rounded-radius-full">
              <Icon as={Clock} size={18} className="text-brand-blue-500" />
            </View>
            <View className="flex-1">
              <Text className="text-caption font-cairo text-text-secondary">Added On</Text>
              <Text className="text-body font-cairo font-bold text-text-primary">
                {formatPrettyDate(item.createdAt)}
              </Text>
            </View>
          </View>

          {/* Last Updated Row */}
          <View className="gap-spacing-12 flex-row items-center">
            <View className="bg-brand-teal-100/55 h-10 w-10 items-center justify-center rounded-radius-full">
              <Icon as={History} size={18} className="text-brand-teal-500" />
            </View>
            <View className="flex-1">
              <Text className="text-caption font-cairo text-text-secondary">Last Updated</Text>
              <Text className="text-body font-cairo font-bold text-text-primary">
                {formatPrettyDate(item.updatedAt)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View className="border-t border-surface-border bg-surface-surface px-spacing-16 py-spacing-16">
        <Pressable
          onPress={() => setDeleteVisible(true)}
          className="flex-row items-center justify-center gap-spacing-8 rounded-radius-full border border-status-error bg-surface-surface py-spacing-16 active:opacity-75"
          accessibilityRole="button"
          accessibilityLabel="Delete item">
          <Icon as={Trash2} size={18} className="text-status-error" />
          <Text className="text-body font-cairo font-bold text-status-error">Delete Item</Text>
        </Pressable>
      </View>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationModal
        visible={deleteVisible}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteVisible(false)}
      />

      <PantryNotificationModal
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}
