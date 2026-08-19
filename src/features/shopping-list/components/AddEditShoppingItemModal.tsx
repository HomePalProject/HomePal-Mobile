import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Platform, Modal, ScrollView, Keyboard } from 'react-native';
import { X, ChevronDown, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/src/components/ui/icon';
import {
  ShoppingListItemResponse,
  CreateShoppingListItemRequest,
  UpdateShoppingListItemRequest,
  ProductCategoryResponse,
  MeasuringUnitResponse,
} from '@/src/types/api';
import { useTranslation } from 'react-i18next';
import { useAddEditShoppingItemForm } from '../hooks/useAddEditShoppingItemForm';
import { AppBottomSheet } from '@/src/components/ui/bottom-sheet';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput as TextInput,
} from '@gorhom/bottom-sheet';

interface AddEditShoppingItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    payload: CreateShoppingListItemRequest | UpdateShoppingListItemRequest,
    id?: string
  ) => void;
  editItem?: ShoppingListItemResponse | null;
  categories: ProductCategoryResponse[];
  measuringUnits: MeasuringUnitResponse[];
  isSaving?: boolean;
}

export function AddEditShoppingItemModal({
  visible,
  onClose,
  onSave,
  editItem,
  categories,
  measuringUnits,
  isSaving,
}: AddEditShoppingItemModalProps) {
  const { t } = useTranslation('shopping');
  const {
    name,
    setName,
    quantity,
    setQuantity,
    portionCount,
    setPortionCount,
    price,
    handlePriceChange,
    unitId,
    setUnitId,
    categoryId,
    setCategoryId,
    notes,
    setNotes,
  } = useAddEditShoppingItemForm(editItem);

  const mainBottomSheetRef = useRef<BottomSheetModal>(null);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const isEditing = !!editItem;

  useEffect(() => {
    if (visible) {
      mainBottomSheetRef.current?.present();
    } else {
      mainBottomSheetRef.current?.dismiss();
      setUnitModalVisible(false);
      setCategoryModalVisible(false);
    }
  }, [visible]);

  const handleSave = () => {
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      quantity: parseFloat(quantity) || 1,
      portionCount: parseInt(portionCount, 10) || 1,
      price: price ? parseFloat(price.replace(/,/g, '')) : null,
      unitId: unitId || null,
      categoryId: categoryId || null,
      notes: notes.trim() || null,
    };

    if (isEditing && editItem) {
      onSave(
        { ...payload, isPurchased: editItem.isPurchased } as UpdateShoppingListItemRequest,
        editItem.id
      );
    } else {
      onSave(payload as CreateShoppingListItemRequest);
    }
  };

  const selectedUnit = (measuringUnits || []).find((u) => u.id === unitId);
  const selectedCategory = (categories || []).find((c) => c.id === categoryId);

  return (
    <>
      <AppBottomSheet
        ref={mainBottomSheetRef}
        onDismiss={onClose}
        enablePanDownToClose
        snapPoints={['90%']}
        keyboardBehavior="extend">
        <View className="flex-1 px-spacing-24">
          {/* Header */}
          <View className="relative mb-spacing-24 items-center">
            <Text className="font-cairo text-lg font-bold text-text-primary">
              {isEditing ? t('modal.editTitle') : t('modal.addTitle')}
            </Text>
          </View>

          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Product Name */}
            <View className="mb-spacing-16">
              <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                {t('modal.productName')}
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('modal.productPlaceholder')}
                placeholderTextColor="#A8A29B"
                className="px-spacing-12 py-spacing-10 rounded-radius-medium border border-surface-border bg-surface-surface font-cairo text-sm text-text-primary"
              />
            </View>

            <View className="relative z-20 mb-spacing-16 flex-row gap-spacing-8">
              <View className="flex-1">
                <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                  {t('modal.portionSize')}
                </Text>
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="decimal-pad"
                  className="px-spacing-12 h-[44px] justify-center rounded-radius-medium border border-surface-border bg-surface-surface font-cairo text-sm text-text-primary"
                />
              </View>
              <View className="flex-1">
                <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                  {t('modal.howMany')}
                </Text>
                <TextInput
                  value={portionCount}
                  onChangeText={setPortionCount}
                  keyboardType="number-pad"
                  className="px-spacing-12 h-[44px] justify-center rounded-radius-medium border border-surface-border bg-surface-surface font-cairo text-sm text-text-primary"
                />
              </View>
            </View>

            <View className="relative z-10 mb-spacing-16 flex-row gap-spacing-8">
              <View className="relative flex-1">
                <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                  {t('modal.measuringUnit')}
                </Text>
                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                    setUnitModalVisible(true);
                  }}
                  android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
                  className="px-spacing-12 h-[44px] flex-row items-center justify-between overflow-hidden rounded-radius-medium bg-surface-surface-variant active:opacity-70">
                  <View style={{ width: 14 }} />
                  <Text
                    numberOfLines={1}
                    className="flex-1 text-center font-cairo text-xs font-bold text-text-primary">
                    {selectedUnit ? `${selectedUnit.name}` : t('modal.chooseUnit')}
                  </Text>
                  <Icon as={ChevronDown} size={14} className="text-text-primary" />
                </Pressable>
              </View>
              <View className="relative flex-1">
                <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                  {t('modal.category')}
                </Text>
                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                    setCategoryModalVisible(true);
                  }}
                  android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
                  className="px-spacing-12 h-[44px] flex-row items-center justify-between overflow-hidden rounded-radius-medium bg-surface-surface-variant active:opacity-70">
                  <View style={{ width: 14 }} />
                  <Text
                    numberOfLines={1}
                    className="flex-1 text-center font-cairo text-xs font-bold text-text-primary">
                    {selectedCategory ? selectedCategory.name : t('modal.chooseCategory')}
                  </Text>
                  <Icon as={ChevronDown} size={14} className="text-text-primary" />
                </Pressable>
              </View>
            </View>

            <View className="mb-spacing-16">
              <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                {t('modal.unitPrice')}
              </Text>
              <TextInput
                value={price}
                onChangeText={handlePriceChange}
                keyboardType="decimal-pad"
                placeholder={t('modal.optional')}
                placeholderTextColor="#A8A29B"
                className="px-spacing-12 h-[44px] justify-center rounded-radius-medium border border-surface-border bg-surface-surface font-cairo text-sm text-text-primary"
              />
            </View>

            {/* Notes */}
            <View className="mb-spacing-24">
              <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                {t('modal.notes')}
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder={t('modal.notesPlaceholder')}
                placeholderTextColor="#A8A29B"
                className="px-spacing-12 h-[44px] justify-center rounded-radius-medium border border-surface-border bg-surface-surface font-cairo text-sm text-text-primary"
              />
            </View>
          </BottomSheetScrollView>

          {/* Action Buttons */}
          <View className="gap-spacing-12 mb-spacing-16 mt-spacing-8 flex-row pt-spacing-8">
            <Pressable
              onPress={() => mainBottomSheetRef.current?.dismiss()}
              className="flex-1 items-center justify-center rounded-radius-full border border-text-secondary bg-surface-background py-spacing-16 active:opacity-70">
              <Text className="font-cairo text-sm font-bold text-brand-primary">
                {t('modal.cancel')}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={!name.trim() || isSaving}
              className={`flex-1 items-center justify-center rounded-radius-full py-spacing-16 active:opacity-80 ${
                !name.trim() || isSaving ? 'bg-surface-border' : 'bg-brand-primary'
              }`}>
              <Text className="font-cairo text-sm font-bold text-text-inverse">
                {isSaving ? t('modal.saving') : t('modal.saveItem')}
              </Text>
            </Pressable>
          </View>
        </View>
      </AppBottomSheet>

      {/* Unit Selection Modal */}
      <Modal
        visible={unitModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setUnitModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50 px-spacing-24">
          <View className="max-h-[70%] w-full overflow-hidden rounded-3xl bg-surface-surface">
            <View className="flex-row items-center justify-between border-b border-surface-border px-6 py-4">
              <Text className="font-cairo text-[18px] font-bold text-text-primary">
                {t('modal.selectUnit')}
              </Text>
              <Pressable
                onPress={() => setUnitModalVisible(false)}
                className="h-8 w-8 items-center justify-center rounded-full bg-surface-surface-variant active:opacity-70">
                <Icon as={X} size={16} className="text-text-primary" />
              </Pressable>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}>
              <Pressable
                onPress={() => {
                  setUnitId(null);
                  setUnitModalVisible(false);
                }}
                android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
                className="flex-row items-center justify-between border-b border-surface-border px-6 py-4">
                <Text
                  className={`font-cairo text-[15px] ${!unitId ? 'font-bold text-brand-primary' : 'text-text-primary'}`}>
                  {t('modal.noUnit')}
                </Text>
                {!unitId && <Icon as={Check} size={18} className="text-brand-primary" />}
              </Pressable>
              {(measuringUnits || []).map((unit) => (
                <Pressable
                  key={unit.id}
                  onPress={() => {
                    setUnitId(unit.id);
                    setUnitModalVisible(false);
                  }}
                  android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
                  className="flex-row items-center justify-between border-b border-surface-border px-6 py-4">
                  <Text
                    className={`font-cairo text-[15px] ${unitId === unit.id ? 'font-bold text-brand-primary' : 'text-text-primary'}`}>
                    {unit.name} ({unit.symbol})
                  </Text>
                  {unitId === unit.id && (
                    <Icon as={Check} size={18} className="text-brand-primary" />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Category Selection Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50 px-spacing-24">
          <View className="max-h-[70%] w-full overflow-hidden rounded-3xl bg-surface-surface">
            <View className="flex-row items-center justify-between border-b border-surface-border px-6 py-4">
              <Text className="font-cairo text-[18px] font-bold text-text-primary">
                {t('modal.selectCategory')}
              </Text>
              <Pressable
                onPress={() => setCategoryModalVisible(false)}
                className="h-8 w-8 items-center justify-center rounded-full bg-surface-surface-variant active:opacity-70">
                <Icon as={X} size={16} className="text-text-primary" />
              </Pressable>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}>
              <Pressable
                onPress={() => {
                  setCategoryId(null);
                  setCategoryModalVisible(false);
                }}
                android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
                className="flex-row items-center justify-between border-b border-surface-border px-6 py-4">
                <Text
                  className={`font-cairo text-[15px] ${!categoryId ? 'font-bold text-brand-primary' : 'text-text-primary'}`}>
                  {t('modal.noCategory')}
                </Text>
                {!categoryId && <Icon as={Check} size={18} className="text-brand-primary" />}
              </Pressable>
              {(categories || []).map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => {
                    setCategoryId(category.id);
                    setCategoryModalVisible(false);
                  }}
                  android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
                  className="flex-row items-center justify-between border-b border-surface-border px-6 py-4">
                  <Text
                    className={`font-cairo text-[15px] ${categoryId === category.id ? 'font-bold text-brand-primary' : 'text-text-primary'}`}>
                    {category.name}
                  </Text>
                  {categoryId === category.id && (
                    <Icon as={Check} size={18} className="text-brand-primary" />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
