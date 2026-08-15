import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
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
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [portionCount, setPortionCount] = useState('1');
  const [price, setPrice] = useState('');
  const [unitId, setUnitId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const mainBottomSheetRef = useRef<BottomSheetModal>(null);
  const unitBottomSheetRef = useRef<BottomSheetModal>(null);
  const categoryBottomSheetRef = useRef<BottomSheetModal>(null);

  const insets = useSafeAreaInsets();
  const isEditing = !!editItem;

  useEffect(() => {
    if (editItem) {
      setName(editItem.name || '');
      setQuantity(String(editItem.quantity || 1));
      setPortionCount(String(editItem.portionCount || 1));
      setPrice(
        editItem.price ? editItem.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
      );
      setUnitId(editItem.unitId || null);
      setCategoryId(editItem.categoryId || null);
      setNotes(editItem.notes || '');
    } else {
      resetForm();
    }
  }, [editItem]);

  useEffect(() => {
    if (visible) {
      mainBottomSheetRef.current?.present();
    } else {
      mainBottomSheetRef.current?.dismiss();
      unitBottomSheetRef.current?.dismiss();
      categoryBottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const resetForm = () => {
    setName('');
    setQuantity('1');
    setPortionCount('1');
    setPrice('');
    setUnitId(null);
    setCategoryId(null);
    setNotes('');
  };

  const handlePriceChange = (text: string) => {
    let cleaned = text.replace(/[^0-9.]/g, '');
    if (!cleaned) {
      setPrice('');
      return;
    }

    const parts = cleaned.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts.slice(1).join('').slice(0, 2) : '';

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setPrice(formattedInteger + decimalPart);
  };

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
              <View className="flex-[0.8]">
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
              <View className="flex-[0.8]">
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
              <View className="relative flex-[1.2]">
                <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                  {t('modal.measuringUnit')}
                </Text>
                <Pressable
                  onPress={() => unitBottomSheetRef.current?.present()}
                  className="px-spacing-12 h-[44px] flex-row items-center justify-between rounded-radius-medium bg-surface-surface-variant active:opacity-70">
                  <Text
                    numberOfLines={1}
                    className="flex-1 font-cairo text-xs font-bold text-text-primary">
                    {selectedUnit ? `${selectedUnit.name}` : t('modal.chooseUnit')}
                  </Text>
                  <Icon as={ChevronDown} size={14} className="text-text-primary" />
                </Pressable>
              </View>
            </View>

            <View className="relative z-10 mb-spacing-16 flex-row gap-spacing-8">
              <View className="flex-1">
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
              <View className="relative flex-1">
                <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                  {t('modal.category')}
                </Text>
                <Pressable
                  onPress={() => categoryBottomSheetRef.current?.present()}
                  className="px-spacing-12 h-[44px] flex-row items-center justify-between rounded-radius-medium bg-surface-surface-variant active:opacity-70">
                  <Text
                    numberOfLines={1}
                    className="flex-1 font-cairo text-xs font-bold text-text-primary">
                    {selectedCategory ? selectedCategory.name : t('modal.chooseCategory')}
                  </Text>
                  <Icon as={ChevronDown} size={14} className="text-text-primary" />
                </Pressable>
              </View>
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

      {/* Unit Selection Bottom Sheet */}
      <AppBottomSheet ref={unitBottomSheetRef} enablePanDownToClose snapPoints={['50%', '80%']}>
        <View className="flex-row items-center justify-between border-b border-surface-border px-6 py-4">
          <Text className="font-cairo text-[18px] font-bold text-text-primary">
            {t('modal.selectUnit')}
          </Text>
          <Pressable
            onPress={() => unitBottomSheetRef.current?.dismiss()}
            className="h-8 w-8 items-center justify-center rounded-full bg-surface-surface-variant active:opacity-70">
            <Icon as={X} size={16} className="text-text-primary" />
          </Pressable>
        </View>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}>
          <Pressable
            onPress={() => {
              setUnitId(null);
              unitBottomSheetRef.current?.dismiss();
            }}
            className="flex-row items-center justify-between border-b border-surface-border px-6 py-4 active:bg-surface-surface-variant">
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
                unitBottomSheetRef.current?.dismiss();
              }}
              className="flex-row items-center justify-between border-b border-surface-border px-6 py-4 active:bg-surface-surface-variant">
              <Text
                className={`font-cairo text-[15px] ${unitId === unit.id ? 'font-bold text-brand-primary' : 'text-text-primary'}`}>
                {unit.name} ({unit.symbol})
              </Text>
              {unitId === unit.id && <Icon as={Check} size={18} className="text-brand-primary" />}
            </Pressable>
          ))}
        </BottomSheetScrollView>
      </AppBottomSheet>

      {/* Category Selection Bottom Sheet */}
      <AppBottomSheet ref={categoryBottomSheetRef} enablePanDownToClose snapPoints={['50%', '80%']}>
        <View className="flex-row items-center justify-between border-b border-surface-border px-6 py-4">
          <Text className="font-cairo text-[18px] font-bold text-text-primary">
            {t('modal.selectCategory')}
          </Text>
          <Pressable
            onPress={() => categoryBottomSheetRef.current?.dismiss()}
            className="h-8 w-8 items-center justify-center rounded-full bg-surface-surface-variant active:opacity-70">
            <Icon as={X} size={16} className="text-text-primary" />
          </Pressable>
        </View>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}>
          <Pressable
            onPress={() => {
              setCategoryId(null);
              categoryBottomSheetRef.current?.dismiss();
            }}
            className="flex-row items-center justify-between border-b border-surface-border px-6 py-4 active:bg-surface-surface-variant">
            <Text
              className={`font-cairo text-[15px] ${!categoryId ? 'font-bold text-brand-primary' : 'text-text-primary'}`}>
              {t('modal.noCategory')}
            </Text>
            {!categoryId && <Icon as={Check} size={18} className="text-brand-primary" />}
          </Pressable>
          {(categories || []).map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => {
                setCategoryId(cat.id);
                categoryBottomSheetRef.current?.dismiss();
              }}
              className="flex-row items-center justify-between border-b border-surface-border px-6 py-4 active:bg-surface-surface-variant">
              <Text
                className={`font-cairo text-[15px] ${categoryId === cat.id ? 'font-bold text-brand-primary' : 'text-text-primary'}`}>
                {cat.name}
              </Text>
              {categoryId === cat.id && (
                <Icon as={Check} size={18} className="text-brand-primary" />
              )}
            </Pressable>
          ))}
        </BottomSheetScrollView>
      </AppBottomSheet>
    </>
  );
}
