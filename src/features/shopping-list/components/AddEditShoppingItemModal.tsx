import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [portionCount, setPortionCount] = useState('1');
  const [price, setPrice] = useState('');
  const [unitId, setUnitId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
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
  }, [editItem, visible]);

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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center px-spacing-24">
        <View className="max-h-[90%] w-full rounded-3xl bg-surface-background p-spacing-24 shadow-lg">
          {/* Header */}
          <View className="relative mb-spacing-24 items-center">
            <Text className="font-cairo text-lg font-bold text-text-primary">
              {isEditing ? 'Edit Shopping Item' : 'Add Shopping Item'}
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}>
            {/* Product Name */}
            <View className="mb-spacing-16">
              <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                Product Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Fresh Milk, Olive Oil, Rice..."
                placeholderTextColor="#A8A29B"
                className="px-spacing-12 py-spacing-10 rounded-radius-medium border border-surface-border bg-surface-surface font-cairo text-sm text-text-primary"
              />
            </View>

            {/* Portion Size / How Many / Unit — 3 columns */}
            <View className="relative z-20 mb-spacing-16 flex-row gap-spacing-8">
              <View className="flex-[0.8]">
                <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                  Portion Size
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
                  How Many{'\n'}(Portions)
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
                  Measuring Unit
                </Text>
                <Pressable
                  onPress={() => {
                    setShowUnitPicker(!showUnitPicker);
                    setShowCategoryPicker(false);
                  }}
                  className="px-spacing-12 h-[44px] flex-row items-center justify-between rounded-radius-medium bg-surface-surface-variant active:opacity-70">
                  <Text
                    numberOfLines={1}
                    className="flex-1 font-cairo text-xs font-bold text-text-primary">
                    {selectedUnit ? `${selectedUnit.name}` : 'Choose Unit...'}
                  </Text>
                  <Icon as={ChevronDown} size={14} className="text-text-primary" />
                </Pressable>

                {/* Unit Picker Trigger */}
              </View>
            </View>

            {/* Price / Category — 2 columns */}
            <View className="relative z-10 mb-spacing-16 flex-row gap-spacing-8">
              <View className="flex-1">
                <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                  Unit Price (EGP)
                </Text>
                <TextInput
                  value={price}
                  onChangeText={handlePriceChange}
                  keyboardType="decimal-pad"
                  placeholder="Optional"
                  placeholderTextColor="#A8A29B"
                  className="px-spacing-12 h-[44px] justify-center rounded-radius-medium border border-surface-border bg-surface-surface font-cairo text-sm text-text-primary"
                />
              </View>
              <View className="relative flex-1">
                <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                  Category
                </Text>
                <Pressable
                  onPress={() => {
                    setShowCategoryPicker(!showCategoryPicker);
                    setShowUnitPicker(false);
                  }}
                  className="px-spacing-12 h-[44px] flex-row items-center justify-between rounded-radius-medium bg-surface-surface-variant active:opacity-70">
                  <Text
                    numberOfLines={1}
                    className="flex-1 font-cairo text-xs font-bold text-text-primary">
                    {selectedCategory ? selectedCategory.name : 'Choose Category...'}
                  </Text>
                  <Icon as={ChevronDown} size={14} className="text-text-primary" />
                </Pressable>

                {/* Category Picker Trigger */}
              </View>
            </View>

            {/* Notes */}
            <View className="mb-spacing-24">
              <Text className="mb-spacing-4 text-center font-cairo text-xs font-bold text-text-primary">
                Notes
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Brand name, size, preference..."
                placeholderTextColor="#A8A29B"
                className="px-spacing-12 h-[44px] justify-center rounded-radius-medium border border-surface-border bg-surface-surface font-cairo text-sm text-text-primary"
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="gap-spacing-12 mt-spacing-8 flex-row pt-spacing-8">
            <Pressable
              onPress={onClose}
              className="flex-1 items-center justify-center rounded-radius-full border border-text-secondary bg-surface-background py-spacing-16 active:opacity-70">
              <Text className="font-cairo text-sm font-bold text-brand-primary">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={!name.trim() || isSaving}
              className={`flex-1 items-center justify-center rounded-radius-full py-spacing-16 active:opacity-80 ${
                !name.trim() || isSaving ? 'bg-surface-border' : 'bg-brand-primary'
              }`}>
              <Text className="font-cairo text-sm font-bold text-text-inverse">
                {isSaving ? 'Saving...' : 'Save Item'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Unit Selection Bottom Sheet Modal */}
      <Modal
        visible={showUnitPicker}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowUnitPicker(false)}>
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setShowUnitPicker(false)}>
          <Pressable
            className="max-h-[60%] w-full rounded-t-3xl bg-surface-surface pb-8"
            onPress={(e) => e.stopPropagation()}>
            <View className="flex-row items-center justify-between border-b border-surface-border px-6 py-4">
              <Text className="font-cairo text-[18px] font-bold text-text-primary">
                Select Measuring Unit
              </Text>
              <Pressable
                onPress={() => setShowUnitPicker(false)}
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
                  setShowUnitPicker(false);
                }}
                className="flex-row items-center justify-between border-b border-surface-border px-6 py-4 active:bg-surface-surface-variant">
                <Text
                  className={`font-cairo text-[15px] ${!unitId ? 'font-bold text-brand-primary' : 'text-text-primary'}`}>
                  -- No Unit --
                </Text>
                {!unitId && <Icon as={Check} size={18} className="text-brand-primary" />}
              </Pressable>
              {(measuringUnits || []).map((unit) => (
                <Pressable
                  key={unit.id}
                  onPress={() => {
                    setUnitId(unit.id);
                    setShowUnitPicker(false);
                  }}
                  className="flex-row items-center justify-between border-b border-surface-border px-6 py-4 active:bg-surface-surface-variant">
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
          </Pressable>
        </Pressable>
      </Modal>

      {/* Category Selection Bottom Sheet Modal */}
      <Modal
        visible={showCategoryPicker}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCategoryPicker(false)}>
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setShowCategoryPicker(false)}>
          <Pressable
            className="max-h-[60%] w-full rounded-t-3xl bg-surface-surface pb-8"
            onPress={(e) => e.stopPropagation()}>
            <View className="flex-row items-center justify-between border-b border-surface-border px-6 py-4">
              <Text className="font-cairo text-[18px] font-bold text-text-primary">
                Select Category
              </Text>
              <Pressable
                onPress={() => setShowCategoryPicker(false)}
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
                  setShowCategoryPicker(false);
                }}
                className="flex-row items-center justify-between border-b border-surface-border px-6 py-4 active:bg-surface-surface-variant">
                <Text
                  className={`font-cairo text-[15px] ${!categoryId ? 'font-bold text-brand-primary' : 'text-text-primary'}`}>
                  -- No Category --
                </Text>
                {!categoryId && <Icon as={Check} size={18} className="text-brand-primary" />}
              </Pressable>
              {(categories || []).map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => {
                    setCategoryId(cat.id);
                    setShowCategoryPicker(false);
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
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
}
