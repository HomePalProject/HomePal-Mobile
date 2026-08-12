import React, { useState, useEffect } from 'react';
import { View, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { ProductCategoryResponse, MeasuringUnitResponse } from '@/src/types/api';
import { CategorySelectorSheet } from './CategorySelectorSheet';
import { UnitSelectorSheet } from './UnitSelectorSheet';
import { ExpirationDatePickerModal } from './ExpirationDatePickerModal';
import { AIScanModalHeader } from './AIScanModalHeader';
import { AIScanLoadingState } from './AIScanLoadingState';
import { AIScanItemRow, ScannedItem } from './AIScanItemRow';
import { AIScanActionButtons } from './AIScanActionButtons';

interface AIScanModalProps {
  visible: boolean;
  status: 'loading' | 'success';
  categories: ProductCategoryResponse[];
  measuringUnits: MeasuringUnitResponse[];
  onClose: () => void;
  onAddSelected: (items: Omit<ScannedItem, 'selected'>[]) => void;
  isSaving?: boolean;
  scannedItems: ScannedItem[];
}

export function AIScanModal({
  visible,
  status,
  categories,
  measuringUnits,
  onClose,
  onAddSelected,
  isSaving,
  scannedItems,
}: AIScanModalProps) {
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [activePicker, setActivePicker] = useState<'category' | 'unit' | 'date' | null>(null);

  useEffect(() => {
    if (visible && status === 'success') {
      setItems(scannedItems);
    }
  }, [visible, status, scannedItems]);

  useEffect(() => {
    if (!visible) {
      setItems([]);
      setActiveItemIndex(null);
      setActivePicker(null);
    }
  }, [visible]);

  const handleToggleSelect = (idx: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleUpdateField = (idx: number, field: keyof ScannedItem, val: any) => {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item)));
  };

  const handleAddItems = () => {
    const selectedItems = items.filter((item) => item.selected);
    if (selectedItems.length === 0) return;
    onAddSelected(
      selectedItems.map(({ name, quantity, categoryId, measuringUnitId, expireDate }) => ({
        name,
        quantity,
        categoryId,
        measuringUnitId,
        expireDate,
      }))
    );
  };

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || 'Select';
  const getUnitName = (id: string) => measuringUnits.find((u) => u.id === id)?.name || 'Select';

  const hasSelections = items.some((i) => i.selected);

  const handleOpenPicker = (idx: number, picker: 'category' | 'unit' | 'date') => {
    setActiveItemIndex(idx);
    setActivePicker(picker);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <KeyboardAvoidingView
          className="w-full justify-end"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View className="rounded-t-radius-extraLarge max-h-[85%] w-full overflow-hidden bg-surface-surface px-spacing-24 pb-spacing-32 pt-spacing-24 shadow-xl">
            {/* Header */}
            <AIScanModalHeader onClose={onClose} />

            {/* Content Body */}
            <View className="min-h-[300px] flex-1">
              {status === 'loading' ? (
                <AIScanLoadingState />
              ) : (
                <View className="flex-1">
                  <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {items.map((item, idx) => (
                      <AIScanItemRow
                        key={`scanned-${idx}`}
                        item={item}
                        index={idx}
                        onToggleSelect={handleToggleSelect}
                        onUpdateField={handleUpdateField}
                        onOpenPicker={handleOpenPicker}
                        getCategoryName={getCategoryName}
                        getUnitName={getUnitName}
                      />
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Bottom Actions */}
            {status === 'success' && (
              <AIScanActionButtons
                hasSelections={hasSelections}
                isSaving={isSaving || false}
                onAddPress={handleAddItems}
                onCancelPress={onClose}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Popovers */}
      {activeItemIndex !== null && (
        <>
          <CategorySelectorSheet
            visible={activePicker === 'category'}
            categories={categories}
            selectedId={items[activeItemIndex]?.categoryId}
            onSelect={(cat) => {
              handleUpdateField(activeItemIndex, 'categoryId', cat.id);
              setActivePicker(null);
            }}
            onClose={() => setActivePicker(null)}
          />

          <UnitSelectorSheet
            visible={activePicker === 'unit'}
            units={measuringUnits}
            selectedId={items[activeItemIndex]?.measuringUnitId}
            onSelect={(ut) => {
              handleUpdateField(activeItemIndex, 'measuringUnitId', ut.id);
              setActivePicker(null);
            }}
            onClose={() => setActivePicker(null)}
          />

          <ExpirationDatePickerModal
            visible={activePicker === 'date'}
            value={items[activeItemIndex]?.expireDate || ''}
            onChange={(dt) => {
              handleUpdateField(activeItemIndex, 'expireDate', dt);
              setActivePicker(null);
            }}
            onClose={() => setActivePicker(null)}
          />
        </>
      )}
    </Modal>
  );
}
