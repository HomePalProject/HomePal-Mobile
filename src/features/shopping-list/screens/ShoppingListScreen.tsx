import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, Alert, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Plus, ShoppingCart } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import * as Haptics from 'expo-haptics';
import { colors } from '@/src/theme/colors';
import { useShoppingList } from '../hooks/useShoppingList';
import {
  ShoppingListHeader,
  ShoppingListSummaryBar,
  ShoppingListItemCard,
  ShoppingListEmptyView,
  AddEditShoppingItemModal,
  ShoppingListSkeleton,
} from '../components';
import {
  ShoppingListItemResponse,
  CreateShoppingListItemRequest,
  UpdateShoppingListItemRequest,
} from '@/src/types/api';

export default function ShoppingListScreen() {
  const {
    items,
    categories,
    measuringUnits,
    isLoading,
    error,
    loadShoppingList,
    addItem,
    editItem,
    removeItem,
    toggleItem,
    clearPurchased,
    clearError,
  } = useShoppingList();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingListItemResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadShoppingList();
  }, [loadShoppingList]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadShoppingList();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalVisible(true);
  };

  const handleEditItem = (item: ShoppingListItemResponse) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeItem(id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch {
            Alert.alert('Error', 'Failed to delete item.');
          }
        },
      },
    ]);
  };

  const handleToggleItem = async (id: string) => {
    try {
      await toggleItem(id);
    } catch {
      // Error is handled by the slice (optimistic revert)
    }
  };

  const handleSave = async (
    payload: CreateShoppingListItemRequest | UpdateShoppingListItemRequest,
    id?: string
  ) => {
    setIsSaving(true);
    try {
      if (id) {
        await editItem(id, payload as UpdateShoppingListItemRequest);
      } else {
        await addItem(payload as CreateShoppingListItemRequest);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsModalVisible(false);
      setEditingItem(null);
    } catch {
      Alert.alert('Error', 'Failed to save item. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearPurchased = () => {
    const purchasedCount = items.filter((i) => i.isPurchased).length;
    if (purchasedCount === 0) {
      Alert.alert('No Purchased Items', 'There are no purchased items to clear.');
      return;
    }
    Alert.alert(
      'Clear Purchased',
      `Remove ${purchasedCount} purchased item${purchasedCount > 1 ? 's' : ''} from your list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearPurchased();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch {
              Alert.alert('Error', 'Failed to clear purchased items.');
            }
          },
        },
      ]
    );
  };

  const renderItem = useCallback(
    ({ item }: { item: ShoppingListItemResponse }) => (
      <ShoppingListItemCard
        item={item}
        onToggle={handleToggleItem}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />
    ),
    []
  );

  const renderContent = () => {
    if (isLoading && items.length === 0) {
      return <ShoppingListSkeleton />;
    }

    if (error && items.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-spacing-24">
          <Text className="text-body mb-spacing-16 text-center font-cairo text-status-error">
            {error}
          </Text>
          <Pressable
            onPress={() => {
              clearError();
              loadShoppingList();
            }}
            className="py-spacing-12 rounded-radius-medium bg-brand-primary px-spacing-24 active:opacity-80">
            <Text className="font-cairo text-base font-bold text-text-inverse">Retry</Text>
          </Pressable>
        </View>
      );
    }

    if (items.length === 0) {
      return <ShoppingListEmptyView onAddItem={handleAddItem} />;
    }

    return (
      <View className="mb-spacing-16">
        <ShoppingListSummaryBar items={items} />
        <View className="bg-surface-border/50 mb-spacing-16 h-px" />
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.brand.primary]}
              tintColor={colors.brand.primary}
            />
          }
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <ShoppingListHeader />

      <View className="flex-1 px-spacing-16 pt-spacing-16">
        {/* Main White Card Wrapper */}
        <View className="flex-1 rounded-3xl border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
          {/* Card Header & Title */}
          <View className="mb-spacing-16 flex-row items-center gap-spacing-8">
            <Icon as={ShoppingCart} size={20} className="text-brand-primary" />
            <Text className="font-cairo text-lg font-black text-brand-primary">
              Household Shopping List
            </Text>
          </View>

          {/* Action Buttons Row */}
          <View className="gap-spacing-12 mb-spacing-16 flex-row items-center">
            <Pressable
              onPress={handleAddItem}
              className="flex-row items-center gap-spacing-4 rounded-full bg-brand-primary px-spacing-16 py-spacing-8 shadow-sm active:opacity-80">
              <Icon as={Plus} size={14} className="text-white" />
              <Text className="font-cairo text-sm font-bold text-text-inverse">Add Item</Text>
            </Pressable>
            {items.some((i) => i.isPurchased) && (
              <Pressable
                onPress={handleClearPurchased}
                className="flex-row items-center rounded-full bg-brand-accent-container px-spacing-16 py-spacing-8 shadow-sm active:opacity-80">
                <Text className="font-cairo text-sm font-bold text-brand-accent">
                  Clear Purchased
                </Text>
              </Pressable>
            )}
          </View>

          {/* Content (Summary Bar + List) */}
          {renderContent()}
        </View>
      </View>

      <AddEditShoppingItemModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        editItem={editingItem}
        categories={categories || []}
        measuringUnits={measuringUnits || []}
        isSaving={isSaving}
      />
    </SafeAreaView>
  );
}
