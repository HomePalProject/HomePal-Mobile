import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Keyboard } from 'react-native';
import { Box, Paperclip } from 'lucide-react-native';
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

// Import shared pantry form UI components
import { FieldLabel } from '@/src/features/pantry/components/FieldLabel';
import { FormDropdown } from '@/src/features/pantry/components/FormDropdown';
import { QuantityStepper } from '@/src/features/pantry/components/QuantityStepper';
import {
  CategorySelectorSheet,
  getCategoryIconConfig,
} from '@/src/features/pantry/components/CategorySelectorSheet';
import { UnitSelectorSheet } from '@/src/features/pantry/components/UnitSelectorSheet';

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
  const categorySheetRef = useRef<BottomSheetModal>(null);
  const unitSheetRef = useRef<BottomSheetModal>(null);

  const isEditing = !!editItem;

  useEffect(() => {
    if (visible) {
      mainBottomSheetRef.current?.present();
    } else {
      mainBottomSheetRef.current?.dismiss();
      categorySheetRef.current?.dismiss();
      unitSheetRef.current?.dismiss();
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
              {isEditing
                ? t('modal.editTitle', 'Edit Shopping Item')
                : t('modal.addTitle', 'Add Shopping Item')}
            </Text>
          </View>

          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Product Name */}
            <View className="mb-spacing-24">
              <FieldLabel label={t('modal.productName', 'Product Name')} required />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('modal.productPlaceholder', 'e.g. Fresh Milk, Olive Oil...')}
                placeholderTextColor="#A8A29B"
                className="text-body h-14 rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16 font-cairo text-text-primary"
              />
            </View>

            {/* Quantity and Unit Row */}
            <View className="gap-spacing-12 mb-spacing-24 flex-row">
              <View className="flex-[0.8]">
                <FieldLabel label={t('modal.portionSize', 'Quantity')} required />
                <QuantityStepper
                  value={parseFloat(quantity) || 1}
                  onChange={(val) => setQuantity(String(val))}
                  min={1}
                />
              </View>

              <View className="flex-1">
                <FormDropdown
                  label={t('modal.measuringUnit', 'Unit')}
                  value={selectedUnit?.name}
                  placeholder={t('modal.chooseUnit', 'Select')}
                  leadingIcon={Paperclip}
                  onPress={() => {
                    Keyboard.dismiss();
                    unitSheetRef.current?.present();
                  }}
                />
              </View>
            </View>

            {/* How Many Portions */}
            <View className="mb-spacing-24">
              <FieldLabel label={t('modal.howMany', 'How Many (Portions)')} />
              <QuantityStepper
                value={parseInt(portionCount, 10) || 1}
                onChange={(val) => setPortionCount(String(val))}
                min={1}
              />
            </View>

            {/* Category */}
            <View className="mb-spacing-24">
              <FormDropdown
                label={t('modal.category', 'Category')}
                value={selectedCategory?.name}
                placeholder={t('modal.chooseCategory', 'Select a category')}
                leadingIcon={Box}
                activeIcon={
                  selectedCategory ? getCategoryIconConfig(selectedCategory.name).icon : undefined
                }
                activeIconColor={
                  selectedCategory ? getCategoryIconConfig(selectedCategory.name).color : undefined
                }
                onPress={() => {
                  Keyboard.dismiss();
                  categorySheetRef.current?.present();
                }}
              />
            </View>

            {/* Unit Price */}
            <View className="mb-spacing-24">
              <FieldLabel label={t('modal.unitPrice', 'Unit Price (EGP)')} />
              <TextInput
                value={price}
                onChangeText={handlePriceChange}
                keyboardType="decimal-pad"
                placeholder={t('modal.optional', 'Optional')}
                placeholderTextColor="#A8A29B"
                className="text-body h-14 rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16 font-cairo text-text-primary"
              />
            </View>

            {/* Notes */}
            <View className="mb-spacing-24">
              <FieldLabel label={t('modal.notes', 'Notes')} />
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder={t('modal.notesPlaceholder', 'Brand name, size, preference...')}
                placeholderTextColor="#A8A29B"
                className="text-body h-14 rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16 font-cairo text-text-primary"
              />
            </View>
          </BottomSheetScrollView>

          {/* Action Buttons */}
          <View className="gap-spacing-12 mb-spacing-16 mt-spacing-8 flex-row pt-spacing-8">
            <Pressable
              onPress={() => mainBottomSheetRef.current?.dismiss()}
              className="active:bg-surface-surfaceVariant h-14 flex-1 items-center justify-center rounded-radius-full border border-surface-border bg-surface-surface">
              <Text className="text-bodyLarge font-cairo font-bold text-text-secondary">
                {t('modal.cancel', 'Cancel')}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={!name.trim() || isSaving}
              className={`h-14 flex-1 items-center justify-center rounded-radius-full active:opacity-80 ${
                !name.trim() || isSaving ? 'bg-surface-border' : 'bg-brand-primary'
              }`}>
              <Text className="text-bodyLarge font-cairo font-bold text-text-inverse">
                {isSaving ? t('modal.saving', 'Saving...') : t('modal.saveItem', 'Save Item')}
              </Text>
            </Pressable>
          </View>
        </View>
      </AppBottomSheet>

      {/* Reused Pantry Modals */}
      <CategorySelectorSheet
        ref={categorySheetRef}
        categories={categories}
        selectedId={selectedCategory?.id}
        onSelect={(cat) => setCategoryId(cat.id)}
      />

      <UnitSelectorSheet
        ref={unitSheetRef}
        units={measuringUnits}
        selectedId={selectedUnit?.id}
        onSelect={(u) => setUnitId(u.id)}
      />
    </>
  );
}
